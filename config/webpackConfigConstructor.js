/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/6/27.
 * Copyright 2022/6/27 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/6/27
 * @version */
const webpackBuild = require('./webpack.build');
const webpackBasic = require('./webpack.basic');
const { merge } = require('webpack-merge');
module.exports = function (config) {
    const env = config.env;
    const webpackTypes = {
        production: webpackBuild
    };
    return merge(webpackBasic(config), webpackTypes[env](config));
};
