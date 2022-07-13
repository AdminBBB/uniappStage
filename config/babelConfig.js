const librariesImportConfig = {
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
    return {
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
    };
};

