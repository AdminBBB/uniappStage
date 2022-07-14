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
const merge = require('webpack-merge');
module.exports = function webpackBuild (config) {
    const babelConfigOptions = getBabelConfig(config);
    const { webpackConfigEnties, HtmlWebpackPlugins } = getEntries(config);
    const webpackConfig = {
        entry: webpackConfigEnties,
        resolve: {
            extensions: ['.js', 'jsx', '.vue', '.json', '.ts', '.tsx']
            // alias: { 'vue': 'vue/dist/vue.esm.js' }
        },
        module: {
            rules: [
                ...(styleLoader({
                    sourceMap: config.env !== 'production',
                    usePostCSS: true
                }, config)),
                {
                    test: /\.js|jsx$/,
                    use: {
                        loader: 'babel-loader',
                        options: babelConfigOptions
                    },
                    include: [utils.getRootPath('common'), utils.getRootPath('src')]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: `${config.version}/[name].css`,
                chunkFilename: `${config.version}/[name].css`,
                ignoreOrder: true
            }),
            new CssMinimzerWebpackPlugin(),
            new ProgressBarPlugin({
                format: '  building "' + config.projectSourcePath + '" [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
                clear: true
            }),
            ...HtmlWebpackPlugins
        ],
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
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        name: 'vendor',
                        enforce: true
                    },
                    common: {
                        test: /[\\/]common[\\/]|[\\/]utils[\\/]/,
                        chunks: 'all',
                        name: 'common',
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
    return merge(webpackConfig, configByFramework[config.framework]);
};
