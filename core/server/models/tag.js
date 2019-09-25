const ghostBookshelf = require('./base');
const CompanyHelper = require('../data/finpub/company');

const TagTypes = {
    Company: 1
}

let Tag, Tags;

function updateTagMeta(tag) {
    if (!tag.get('meta_title')) {
        tag.set('meta_title', String(company.code + ' - ' + company.name));
    }

    if (!tag.get('meta_description')) {
        tag.set('meta_description', String(company.name) + ' (' + company.exchange + ')');
    }

    if (!tag.get('description')) {
        tag.set('description', 'Những bài phân tích mới nhất tại Finpub về ' + String(company.name) + ' (' + company.exchange + ')');
    }

    tag.set('kind', TagTypes.Company);
}

Tag = ghostBookshelf.Model.extend({

    tableName: 'tags',

    defaults: function defaults() {
        return {
            visibility: 'public'
        };
    },

    emitChange: function emitChange(event, options) {
        const eventToTrigger = 'tag' + '.' + event;
        ghostBookshelf.Model.prototype.emitChange.bind(this)(this, eventToTrigger, options);
    },

    onCreated: function onCreated(model, attrs, options) {
        ghostBookshelf.Model.prototype.onCreated.apply(this, arguments);

        model.emitChange('added', options);
    },

    onUpdated: function onUpdated(model, attrs, options) {
        ghostBookshelf.Model.prototype.onUpdated.apply(this, arguments);

        model.emitChange('edited', options);
    },

    onDestroyed: function onDestroyed(model, options) {
        ghostBookshelf.Model.prototype.onDestroyed.apply(this, arguments);

        model.emitChange('deleted', options);
    },

    onSaving: function onSaving(newTag, attr, options) {
        var self = this;

        ghostBookshelf.Model.prototype.onSaving.apply(this, arguments);

        // name: #later slug: hash-later
        if (/^#/.test(newTag.get('name'))) {
            this.set('visibility', 'internal');
        }

        if (this.hasChanged('slug') || (!this.get('slug') && this.get('name'))) {
            // Pass the new slug through the generator to strip illegal characters, detect duplicates
            return ghostBookshelf.Model.generateSlug(Tag, this.get('slug') || this.get('name'),
                {transacting: options.transacting})
                .then(function then(slug) {
                    self.set({slug: slug});
                });
        }

        let company = CompanyHelper.get(this.get('name'));

        if (company && this.get('kind') !== TagTypes.Company) {
            updateTagMeta(this);
        }
    },

    posts: function posts() {
        return this.belongsToMany('Post');
    },

    toJSON: function toJSON(unfilteredOptions) {
        var options = Tag.filterOptions(unfilteredOptions, 'toJSON'),
            attrs = ghostBookshelf.Model.prototype.toJSON.call(this, options);

        // @NOTE: this serialization should be moved into api layer, it's not being moved as it's not used
        attrs.parent = attrs.parent || attrs.parent_id;
        delete attrs.parent_id;

        return attrs;
    },

    getAction(event, options) {
        const actor = this.getActor(options);

        // @NOTE: we ignore internal updates (`options.context.internal`) for now
        if (!actor) {
            return;
        }

        // @TODO: implement context
        return {
            event: event,
            resource_id: this.id || this.previous('id'),
            resource_type: 'tag',
            actor_id: actor.id,
            actor_type: actor.type
        };
    },

    onCreating: function onCreating(model, attr, options) {
        // overwrite onCreating to automatically add meta_title 
        // and meta_description
        let company = CompanyHelper.get(this.get('name'));
        if (company) {
            updateTagMeta(this);
        }

        // call parent
        return ghostBookshelf.Model.prototype.onCreating.apply(this, arguments);
    }
}, {
    orderDefaultOptions: function orderDefaultOptions() {
        return {};
    },

    permittedOptions: function permittedOptions(methodName) {
        var options = ghostBookshelf.Model.permittedOptions.call(this, methodName),

            // whitelists for the `options` hash argument on methods, by method name.
            // these are the only options that can be passed to Bookshelf / Knex.
            validOptions = {
                findAll: ['columns'],
                findOne: ['columns', 'visibility'],
                destroy: ['destroyAll']
            };

        if (validOptions[methodName]) {
            options = options.concat(validOptions[methodName]);
        }

        return options;
    },

    destroy: function destroy(unfilteredOptions) {
        var options = this.filterOptions(unfilteredOptions, 'destroy', {extraAllowedProperties: ['id']});
        options.withRelated = ['posts'];

        return this.forge({id: options.id})
            .fetch(options)
            .then(function destroyTagsAndPost(tag) {
                return tag.related('posts')
                    .detach(null, options)
                    .then(function destroyTags() {
                        return tag.destroy(options);
                    });
            });
    }
});

Tags = ghostBookshelf.Collection.extend({
    model: Tag
});

module.exports = {
    Tag: ghostBookshelf.model('Tag', Tag),
    Tags: ghostBookshelf.collection('Tags', Tags)
};
