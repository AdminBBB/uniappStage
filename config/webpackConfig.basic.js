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
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimzerWebpackPlugin = require('css-minimizer-webpack-plugin');
const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');
const styleLoader = require('./styleLoader');
const utils = require('./utils');
const getBabelConfig = require('./babelConfig');
const getEntries = require('./getEntries');
const { merge } = require('webpack-merge');
const path = require('path');
module.exports = function webpackBuild (config) {
    const { env, outPutPath, assetsPath, framework } = config;
    const babelConfigOptions = merge(getBabelConfig(config), config.babelConfig || {});
    const { webpackConfigEnties, HtmlWebpackPlugins } = getEntries(config);
    const webpackConfig = {
        profile: true,
        target: env === 'development' ? 'web' : 'browserslist',
        cache: {
            type: 'filesystem'
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
            new WebpackBar({ profile: true, basic: true }),
            ...HtmlWebpackPlugins
        ],
        performance: {
            // false | "error" | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
            hints: 'warning',
            // 开发环境设置较大防止警告
            // 根据入口起点的最大体积，(总文件体积)，控制webpack何时生成性能提示,整数类型,以字节为单位 设置为总共不可以超过 2M,
            maxEntrypointSize: (config.env === 'production') ? 2048000 : 500000000,
            // 最大单个资源体积，默认819200 (bytes)  800kb
            maxAssetSize: (config.env === 'production') ? 819200 : 500000000,
            assetFilter: function (assetFilename) {
                return /\.(js|css|ts|jsx)$/.test(assetFilename);
            }
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
                minSize: 307200, // 规定被提取的模块在压缩前的大小最小值，单位为字节，默认为102400，只有超过了102400字节才会被提取。
                maxSize: config.chunkMaxSize * 1024 || 3072000,// 大于1M的 进行切割
                minChunks: 1,
                maxAsyncRequests: 6, // 按需加载时的最大并行请求数。
                maxInitialRequests: 4, // 入口点的最大并行请求数。
                automaticNameDelimiter: '~',
                name: false,
                cacheGroups: {
                    vendor: {
                        name: 'vendor',
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10 // 优先
                    },
                    common: {
                        name: 'common',
                        test: /[\\/]common[\\/]|[\\/]utils[\\/]/,
                        priority: -10 // 优先
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
