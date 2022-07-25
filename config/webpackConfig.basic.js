const chalk = require('chalk');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimzerWebpackPlugin = require('css-minimizer-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const styleLoader = require('./styleLoader');
const utils = require('./utils');
const getBabelConfig = require('./babelConfig');
const getEntries = require('./getEntries');
const { VueLoaderPlugin } = require('vue-loader');
const { merge } = require('webpack-merge');
const path = require('path');
module.exports = function webpackBuild (config) {
    const { env, outPutPath, assetsPath, framework, projectSourcePath } = config;
    const babelConfigOptions = getBabelConfig(config);
    const { webpackConfigEnties, HtmlWebpackPlugins } = getEntries(config);
    const webpackConfig = {
        stats: 'none',
        entry: webpackConfigEnties,
        devtool: false,
        output: {
            path: path.resolve(__dirname, '../unity/' + outPutPath),
            filename: assetsPath + '/[name].js' + (config.withHash ? '?[fullhash]' : ''),
            chunkFilename: assetsPath + '/[name].js' + (config.withHash ? '?[fullhash]' : '')
        },
        resolve: {
            extensions: ['.js', 'jsx', '.vue', '.json', '.ts', '.tsx']
        },
        module: {
            rules: [
                ...(styleLoader({
                    sourceMap: env !== 'production',
                    usePostCSS: true
                }, config)),
                {
                    test: /\.js|jsx$/,
                    use: {
                        loader: 'babel-loader',
                        options: babelConfigOptions
                    },
                    include: [utils.getRootPath('common'), utils.getRootPath('src'), utils.getRootPath('node_modules/@chjq')]
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
                    include: [utils.getRootPath('common'), utils.getRootPath('src'), utils.getRootPath('node_modules/@chjq')]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: assetsPath + `/[name].css${config.withHash ? '?[fullhash]' : ''}`,
                chunkFilename: assetsPath + `/[name].css${config.withHash ? '?[fullhash]' : ''}`,
                ignoreOrder: true
            }),
            new CssMinimzerWebpackPlugin(),
            new ProgressBarPlugin({
                format: 'building "' + projectSourcePath + '" [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)\t',
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
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        sourceMap: false // set to true if you want JS source maps,
                    },
                    extractComments: false
                })
            ],
            splitChunks: {
                chunks: 'all',
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
                        priority: 10, // 优先
                        enforce: true
                    },
                    common: {
                        test: /[\\/]common[\\/]|[\\/]utils[\\/]/,
                        chunks: 'all',
                        name: 'common',
                        priority: 10, // 优先
                        enforce: true
                    }
                }
            }
        }
    };
    let configByFramework = {
        react: {},
        vue: {
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
        }
    };
    // 遍历src文件，生成入口list;
    // 获取入口
    return merge(webpackConfig, configByFramework[framework]);
};
