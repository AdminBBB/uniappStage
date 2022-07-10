const path = require('path');
const utils = require('./utils');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = function webpackBuild (config) {
    const webpackConfig = {
        module: {
            rules: [
                {
                    test: /index\.js$/
                }
            ]
        }
    };
    // 遍历src文件，生成入口list;
    function getEntries () {
        const cwd = utils.getProjectResPath(config.projectEntryPath);
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
                content: [utils.getRootResPath('common/index.js')],
                pathname: (dirname === '.' ? '' : dirname + '/') + basename,
                ejs: (glob.sync(dirname + '/' + basename + '.{ejs,html}', options))[0]
            };
            if (config.client === 'mobile') {
                entryContent.content.unshift(utils.getRootResPath('common/clientMobile.js'));
            }
            if (config.serviceWorker) {
                entryContent.content.unshift(utils.getRootResPath('common/installSw.js'));
            }
            if (fs.existsSync(`${cwd}/common/index.js`)) {
                entryContent.content.push(`${cwd}/common/index.js`);
            }
            entryContent.content.push(`${cwd}/${entry}`);
            _entries.push(entryContent);
        }
        return _entries;
    }
    // 获取入口
    const entry = getEntries();
    entry.forEach((e) => {
        if (e) {
            webpackConfig.entry[e.pathname] = e.content;
        }
        webpackConfig.plugins.push(new HtmlWebpackPlugin({
            title: config.title || '',
            publicPath: 'auto',
            /* config */
            filename: `${e.pathname}.html`,
            eGuardName: config.eGuardName || config.projectName.split('/').pop(),
            template: e.ejs ? resolve('src/' + config.projectName + '/' + e.ejs) : `${config.commonPath}/index.ejs`,
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
