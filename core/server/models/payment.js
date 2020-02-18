const ghostBookshelf = require('./base');

const Payment = ghostBookshelf.Model.extend({
    tableName: 'payments',

    defaults() {
        return {
            
        };
    },

    emitChange: function emitChange(event, options) {
        const eventToTrigger = 'payment' + '.' + event;
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
    }
}, {
    post() {
        return this.belongsTo('Post');
    },

    member() {
        return this.belongsTo('Member');
    }
});

const Payments = ghostBookshelf.Collection.extend({
    model: Payment
});

module.exports = {
    Payment: ghostBookshelf.model('Payment', Payment),
    Payments: ghostBookshelf.collection('Payments', Payments)
};
