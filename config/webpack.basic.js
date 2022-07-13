const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimzerWebpackPlugin = require('css-minimizer-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const styleLoader = require('./styleLoader');
const chalk = require('chalk');
module.exports = function webpackBuild (config) {
    const webpackConfig = {
        entry: {},
        resolve: {
            extensions: ['.js', 'jsx', '.vue', '.json', '.ts', '.tsx'],
            alias: {}
        },
        module: {
            rules: [
                ...(styleLoader({
                    sourceMap: config.env !== 'production',
                    usePostCSS: true
                }, config)),
                {
                    test: config.framework === 'vue' ? /\.js$/ : /\.js|jsx$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            'plugins': [
                                // '@babel/plugin-transform-modules-umd',
                                // '@babel/plugin-proposal-decorators',
                                // '@babel/plugin-proposal-class-properties',
                                [
                                    '@babel/plugin-transform-runtime',
                                    {
                                        corejs: { version: 3 }
                                    }
                                ]
                                // '@babel/plugin-transform-async-to-generator'
                                // '@babel/plugin-transform-modules-commonjs'
                            ],
                            'presets': [
                                [
                                    '@babel/preset-env',
                                    {
                                        'useBuiltIns': 'usage',
                                        corejs: { version: 3 }
                                    }
                                ]
                            ]
                        }
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
            })
        ]
    };
    // 遍历src文件，生成入口list;
    // 获取入口
    const entry = (function () {
        const cwd = utils.getProjectResPath(config.projectSourcePath);
        const options = {
            cwd
        };
        let rootJs = 'index';
        let pages = 'pages';
        if (config.pages) {
            pages = config.pages.length > 1 ? `{${config.pages.join(',')}}` : config.pages[0];
        }
        if (config.rootHtml) {
            if (typeof config.rootHtml === 'string') {
                rootJs = config.rootHtml;
            } else if (Array.isArray(config.rootHtml)) {
                rootJs = `{${config.rootHtml.join(',')}}`;
            }
        }
        const files_pages = glob.sync(pages + '/**/index.js', options);
        const files_root = glob.sync(rootJs + '.js', options);
        const files = [...files_root, ...files_pages];
        const _entries = [];
        let entry;
        let dirname;
        let basename;
        for (let i = 0; i < files.length; i++) {
            entry = files[i];
            dirname = path.dirname(entry);
            basename = path.basename(entry, '.js');
            const entryContent = {
                content: [utils.getRootPath('common/index.js')],
                pathname: (dirname === '.' ? '' : dirname + '/') + basename,
                ejs: (glob.sync(dirname + '/' + basename + '.{ejs,html}', options))[0]
            };
            // if (config.client === 'mobile') {
            //     entryContent.content.unshift(utils.getRootPath('common/clientMobile.js'));
            // }
            // if (config.serviceWorker) {
            //     entryContent.content.unshift(utils.getRootPath('common/installSw.js'));
            // }
            // if (fs.existsSync(`${cwd}/common/index.js`)) {
            //     entryContent.content.push(`${cwd}/common/index.js`);
            // }
            entryContent.content.push(`${cwd}/${entry}`);
            _entries.push(entryContent);
        }
        return _entries;
    })();
    entry.forEach((e) => {
        if (e) {
            webpackConfig.entry[e.pathname] = e.content;
        }
        webpackConfig.plugins.push(new HtmlWebpackPlugin({
            /* main config */
            filename: `${e.pathname}.html`,
            template: e.ejs ? utils.getProjectResPath(config.projectSourcePath + '/' + e.ejs) : utils.getRootPath('/common/index.ejs'),
            /* paramters in ejs */
            title: config.title || '',
            eGuardName: config.eGuardName || config.projectName,
            /* other default config */
            publicPath: 'auto',
            inject: true,
            hash: config.resourceHash,//给生成的 js 文件一个独特的 hash 值 <script type=text/javascript src=bundle.js?22b9692e22e7be37b57e></script>
            showErrors: true,//webpack 编译出现错误
            minify: {//对 html 文件进行压缩，minify 的属性值是一个压缩选项或者 false 。默认值为false, 不对生成的 html 文件进行压缩
                removeComments: true, // 去除注释
                collapseWhitespace: true //是否去除空格
            },
            chunks: ['common', 'vendor', e.pathname], // 只注入当前页面的静态资源
            chunksSortMode: 'auto'
        }));
    });
    return webpackConfig;
};
