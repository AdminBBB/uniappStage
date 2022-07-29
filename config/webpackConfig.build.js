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
const CompressionWebpackPlugin = require('compression-webpack-plugin');
module.exports = function webpackBuild (config) {
    return {
        mode: 'production',
        plugins: [
            ...config.productionGzipExtensions ?
                [new CompressionWebpackPlugin({
                    filename: '[path][name][ext].gz',
                    algorithm: 'gzip',
                    test: new RegExp(
                        '\\.(' +
                        config.productionGzipExtensions.join('|') +
                        ')'
                    ),
                    threshold: 10240,
                    minRatio: 0.8
                })] : []
        ]
    };
};
