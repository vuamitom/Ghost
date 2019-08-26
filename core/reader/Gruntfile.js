/* eslint-env node */
/* eslint-disable object-shorthand */
'use strict';

module.exports = function (grunt) {
    // Find all of the task which start with `grunt-` and load them, rather than explicitly declaring them all
    require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);
    const path = require('path');
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    const webpackConfig = {
        entry: ['./app/index.js'],
        output: {
            path: path.resolve(__dirname, '..', '..','core', 'built', 'assets'),
            filename: 'finpub.js'            
        },
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.css$/i,
                    use: [process.env.NODE_ENV !== 'production'? 'style-loader': MiniCssExtractPlugin.loader, 'css-loader'],
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                    loader: 'url-loader',
                    options: {
                      limit: 8192,
                    },
                },
            ],

        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'finpub.css',
                chunkFilename: 'finpub.[id].css'
            }),
            new HtmlWebpackPlugin({
                hash: true,
                template: './public/index.html',
                filename: 'index.html' //relative to root of the application
            })
        ],
        devServer: {
            writeToDisk: true
        }
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
            dev: Object.assign({watch: true, mode: 'development'}, webpackConfig)    
        }

    });

    grunt.registerTask('init', 'Install the client dependencies',
        ['shell:npm-install']
    );
    // grunt.registerTask('reader:dev', 'Build reader client', ['watch'])
    // grunt.registerTask('default', ['babel']);
};
