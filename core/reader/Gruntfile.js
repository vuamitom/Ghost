/* eslint-env node */
/* eslint-disable object-shorthand */
'use strict';

module.exports = function (grunt) {
    // Find all of the task which start with `grunt-` and load them, rather than explicitly declaring them all
    require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            built: {
                src: ['dist/**']
            },
            dependencies: {
                src: ['node_modules/**']
            },
            tmp: {
                src: ['tmp/**']
            }
        },

        watch: {
            scripts: {
                files: ['app/*.js', 'app/**/*.js'],
                tasks: ['webpack:build'],
                options: {
                  livereload: true,
                  reload: true
                }
            }
        },

        shell: {
            'npm-install': {
                command: 'yarn install'
            }
        },

        webpack: {
          build: {
            entry: ['./app/app.js'],
            output: {
              path: 'dist',
              filename: 'finpub.js'
            },
            stats: {
              colors: false,
              modules: true,
              reasons: true
            },
            progress: true,
            failOnError: true,
            watch: true,
            module: {
              loaders: [
                { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
              ]
            }
          }
        }

    });

    grunt.registerTask('init', 'Install the client dependencies',
        ['shell:npm-install']
    );
    grunt.registerTask('reader:dev', 'Build reader client', ['watch'])
    // grunt.registerTask('default', ['babel']);
};
