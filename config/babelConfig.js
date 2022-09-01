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
const { merge } = require('webpack-merge');
const librariesImportConfigsMap = {
    public: [
        { libraryName: '@hjq/uts', libraryDirectory: 'lib' }
    ],
    vue: [
        { libraryName: 'vant', libraryDirectory: 'es', style: true, 'camel2DashComponentName': true }
    ],
    react: [
        { libraryName: 'antd', libraryDirectory: 'lib', style: true, 'camel2DashComponentName': true },
        // { libraryName: 'antd-mobile', libraryDirectory: 'lib', style: true, 'camel2DashComponentName': true },
        { libraryName: '@ant-design', libraryDirectory: 'lib', style: true, 'camel2DashComponentName': true }
    ]
};
module.exports = function babelConfig (config) {
    const defaultImportConfig = {
        'libraryDirectory': 'lib',
        'style': false,
        'camel2DashComponentName': false
    };
    const librariesImportConfigs = [...librariesImportConfigsMap.public, ...librariesImportConfigsMap[config.framework], ...(config.librariesImportConfigsMap || [])].map(c => {
        const importConfig = ['import'];
        importConfig.push(Object.assign({}, defaultImportConfig, c), c.libraryName);
        return importConfig;
    });
    const _babelConfig = {
        'plugins': [
            ...librariesImportConfigs,
            '@babel/plugin-transform-modules-commonjs',
            [
                '@babel/plugin-transform-runtime',
                {
                    corejs: 3
                }
            ]
        ],
        'presets': [
            [
                '@babel/preset-env',
                {
                    'useBuiltIns': 'usage',
                    corejs: 3
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

