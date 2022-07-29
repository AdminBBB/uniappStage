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
const cssLoaders = function (options, config) {
    const { cssModules, client } = config;
    options = options || {};
    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap,
            modules: cssModules
        }
    };
    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            postcssOptions: {  // postcss 配置
                plugins: [
                    'postcss-preset-env'
                ]
            }
        }
    };
    if (client === 'mobile') {
        postcssLoader.options.postcssOptions.plugins.push(require('postcss-pxtorem')({ 'rootValue': 37.5, propList: ['*'] }));
    }
    function generateLoaders (loader = null, loaderOptions = {}) {
        let uses = [
            MiniCssExtractPlugin.loader,
            cssLoader,
            postcssLoader
        ];
        if (loader) {
            uses.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }
        return uses;
    }
    return {
        css: generateLoaders(),
        less: generateLoaders('less', { lessOptions: { javascriptEnabled: true } })
    };
};
module.exports = function (options, config) {
    const rules = [];
    const loaders = cssLoaders(options, config);
    for (const extension in loaders) {
        const loader = loaders[extension];
        rules.push({
            test: new RegExp('\\.' + extension + '$'),
            // exclude: /node_modules/,
            use: loader
        });
    }
    return rules;
};

