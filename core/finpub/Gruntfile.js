/* eslint-env node */
/* eslint-disable object-shorthand */
'use strict';

module.exports = function (grunt) {
    // Find all of the task which start with `grunt-` and load them, rather than explicitly declaring them all
    require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);
    const path = require('path');
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const WebpackShellPlugin = require('webpack-shell-plugin');
    const assetPath = '/reader/assets/';


    const generateWebpackConfig = (isProd) => {
        
        let conf = {
            entry: ['./app/index.js'],
            name: 'finpub',
            output: {
                path: path.resolve(__dirname, '..', 'built', 'assets'),
                filename: 'finpub.[name].[chunkhash].js',
                chunkFilename: 'finpub.[name].[chunkhash].js',
                publicPath: assetPath            
            },
            mode: isProd? 'production': 'development',
            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        use: ['babel-loader']
                    },
                    {
                        test: /\.css$/i,
                        use: [!isProd? {
                            loader: 'style-loader', options: {injectType: 'styleTag'}
                        }: MiniCssExtractPlugin.loader, 'css-loader'],
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                        loader: 'url-loader',
                        options: {
                          limit: 8192,
                        },
                    }
                ],

            },
            plugins: [
                new MiniCssExtractPlugin({
                    filename: 'finpub.[chunkhash].css',
                    chunkFilename: 'finpub.[chunkhash].css'
                }),
                new HtmlWebpackPlugin({
                    hash: true,
                    template: './public/index.html',
                    title: 'Finpub Reader',
                    assetPath: assetPath,
                    filename: 'finpub.html' //relative to root of the application
                }),
                new WebpackShellPlugin({
                    onBuildEnd: ['cp ../built/assets/finpub.html ../server/web/finpub/views/' + (isProd ? 'default-prod.html': 'default.html')]
                })
            ],
            devServer: {
                writeToDisk: true
            }
        };

        if (!isProd) {
            conf = Object.assign({
                watch: true,
                devtool: 'inline-source-map'
            }, conf)
        }
        return conf;
    }

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
        //     html: {
        //         files: ['../built/assets/finpub.html'],
        //         tasks: ['shell:cp-html'],
        //     }
        // },

        shell: {
            'npm-install': {
                command: 'yarn install'
            }
        },

        // bgShell: {
        //     watch: {
        //         cmd: function() {
        //             return 'grunt watch:html'
        //         },
        //         bg: true,
        //         stderr: function (chunk) {
        //             grunt.log.error(chunk);
        //         }
        //     }
        // },

        webpack: {
            options: {
                stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
            },
            prod: () => generateWebpackConfig(true),
            dev: () => generateWebpackConfig(false)                
        }

    });

    grunt.registerTask('init', 'Install the client dependencies',
        ['shell:npm-install']
    );

    // grunt.registerTask('reader:dev', 'Build reader client', ['bgShell:watch', 'webpack:dev'])
    // grunt.registerTask('reader:dev', 'Build reader client', ['watch'])
    // grunt.registerTask('default', ['babel']);
};
