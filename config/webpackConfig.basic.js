/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/7/28 .
 * Copyright 2022/7/28  CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/7/28
 * @version */
const chalk = require('chalk');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimzerWebpackPlugin = require('css-minimizer-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const styleLoader = require('./styleLoader');
const utils = require('./utils');
const getBabelConfig = require('./babelConfig');
const getEntries = require('./getEntries');
const { merge } = require('webpack-merge');
const path = require('path');
module.exports = function webpackBuild (config) {
    const { env, outPutPath, assetsPath, framework, projectSourcePath } = config;
    const babelConfigOptions = merge(getBabelConfig(config), config.babelConfig || {});
    const { webpackConfigEnties, HtmlWebpackPlugins } = getEntries(config);
    const webpackConfig = {
        profile: true,
        target: env === 'development' ? 'web' : 'browserslist',
        cache: {
            type: 'filesystem',
            allowCollectingMemory: true,
            version: config.webpackVersion
        },
        stats: 'errors-only',
        entry: webpackConfigEnties,
        output: {
            path: path.resolve(__dirname, '../unity/' + outPutPath),
            filename: assetsPath + '/[name].js' + (config.withHash ? '?[fullhash]' : ''),
            chunkFilename: assetsPath + '/[name].js' + (config.withHash ? '?[fullhash]' : '')
        },
        resolve: {
            extensions: ['ts', '.tsx', '.js', 'jsx', '.vue', '.json', '.ts', '.tsx']
        },
        module: {
            rules: [
                ...(styleLoader({
                    sourceMap: env !== 'production'
                }, config)),
                {
                    test: /\.js|jsx$/,
                    use: {
                        loader: 'babel-loader?cacheDirectory=true',
                        options: babelConfigOptions
                    },
                    include: [utils.getRootPath('common'), utils.getRootPath('src')]
                },
                {
                    test: /\.ts|tsx$/,
                    use: {
                        loader: 'ts-loader',
                        options: Object.assign({
                            configFile: path.resolve(__dirname, 'tsconfig.json')
                        }, config.tsConfig || {})
                    }
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 1 * 1
                        }
                    },
                    generator: {
                        filename: assetsPath + '/images/[hash][ext][query]'
                    },
                    include: [utils.getRootPath('common'), utils.getRootPath('src')]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: assetsPath + `/[name].css${config.withHash ? '?[fullhash]' : ''}`,
                chunkFilename: assetsPath + `/[name].css${config.withHash ? '?[fullhash]' : ''}`,
                ignoreOrder: true
            }),
            new CssMinimzerWebpackPlugin({
                parallel: true
            }),
            new ProgressBarPlugin({
                format: ':msg  "' + projectSourcePath + '" [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)\t',
                clear: true
            }),
            ...HtmlWebpackPlugins
        ],
        performance: {
            // false | "error" | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
            hints: 'warning',
            // 开发环境设置较大防止警告
            // 根据入口起点的最大体积，控制webpack何时生成性能提示,整数类型,以字节为单位
            maxEntrypointSize: (config.env === 'production') ? 30000000 : 500000000,
            // 最大单个资源体积，默认250000 (bytes)
            maxAssetSize: (config.env === 'production') ? 30000000 : 500000000
        },
        optimization: {
            usedExports: true,
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    extractComments: false
                })
            ],
            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                maxSize: 3000000,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: false,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        name: 'vendor',
                        priority: -10, // 优先
                        enforce: true
                    },
                    common: {
                        test: /[\\/]common[\\/]|[\\/]utils[\\/]/,
                        chunks: 'all',
                        name: 'common',
                        priority: -10, // 优先
                        enforce: true
                    }
                }
            }
        }
    };
    let webpackConfigTypeofFramework = (() => {
        switch (framework) {
            case 'vue':
                const { VueLoaderPlugin } = require('vue-loader');
                return {
                    module: {
                        rules: [
                            {
                                test: /\.vue$/,
                                use: {
                                    loader: 'vue-loader'
                                },
                                include: [utils.getRootPath('common'), utils.getRootPath('src')]
                            }
                        ]
                    },
                    plugins: [
                        new VueLoaderPlugin()
                    ]
                };
            case 'react':
                return {};
        }
    })(framework);
    return merge(webpackConfig, webpackConfigTypeofFramework);
};
