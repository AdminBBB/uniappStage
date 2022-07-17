const { merge } = require('webpack-merge');
const librariesImportConfigsMap = {
    vue: [
        { libraryName: 'vant', libraryDirectory: 'es', style: true, 'camel2DashComponentName': true }
    ],
    react: [
        { libraryName: 'antd', libraryDirectory: 'lib', style: true, 'camel2DashComponentName': true },
        { libraryName: 'antd-mobile', libraryDirectory: 'lib', style: true, 'camel2DashComponentName': true },
        { libraryName: '@ant-design', libraryDirectory: 'lib', style: true, 'camel2DashComponentName': true }
    ]
};
module.exports = function babelConfig (config) {
    const defaultImportConfig = {
        'libraryDirectory': 'lib',
        'style': false,
        'camel2DashComponentName': false
    };
    const librariesImportConfigs = librariesImportConfigsMap[config.framework].map(c => {
        const importConfig = ['import'];
        importConfig.push(Object.assign({}, defaultImportConfig, c), c.libraryName);
        return importConfig;
    });
    const _babelConfig = {
        'plugins': [
            ...librariesImportConfigs,
            // '@babel/plugin-transform-modules-umd',
            // '@babel/plugin-proposal-decorators',
            // '@babel/plugin-proposal-class-properties',
            // '@babel/plugin-transform-async-to-generator'
            '@babel/plugin-transform-modules-commonjs',
            [
                '@babel/plugin-transform-runtime',
                {
                    corejs: { version: 3 }
                }
            ]
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
    };
    const configByFramework = {
        react: {
            'presets': ['@babel/preset-react']
        },
        vue: {
            // 'presets': ['@vue/cli-plugin-babel/preset']
        }
    };
    return merge(_babelConfig, configByFramework[config.framework]);
};

