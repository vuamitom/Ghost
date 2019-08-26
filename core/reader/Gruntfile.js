/* eslint-env node */
/* eslint-disable object-shorthand */
'use strict';

module.exports = function (grunt) {
    // Find all of the task which start with `grunt-` and load them, rather than explicitly declaring them all
    require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);


    const webpackConfig = {
        entry: ['./app/index.js'],
        output: {
            path: __dirname,
            filename: 'finpub.js'            
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                }
            ]
        },
        
    };

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

        // watch: {
        //     scripts: {
        //         files: ['app/*.js', 'app/**/*.js'],
        //         tasks: ['webpack:dev'],
        //         options: {
        //           livereload: true,
        //           reload: true
        //         }
        //     }
        // },

        shell: {
            'npm-install': {
                command: 'yarn install'
            }
        },

        webpack: {
            options: {
                stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            },
            prod: webpackConfig,
            dev: Object.assign({watch: true}, webpackConfig)    
        }

    });

    grunt.registerTask('init', 'Install the client dependencies',
        ['shell:npm-install']
    );
    // grunt.registerTask('reader:dev', 'Build reader client', ['watch'])
    // grunt.registerTask('default', ['babel']);
};
