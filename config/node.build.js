/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/5/23.
 * Copyright 2022/5/23 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/5/23
 * @version */
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackBuild = require('./webpack.build');
const pw = function (config) {
    process.env.PROJECT_CLIENT = config.client;
    process.env.FRAMEWORK_TYPE = config.framework = config.framework || 'vue';
    return new Promise((resolve, reject) => {
        const webpackConfig = webpackBuild(config);
        console.log(webpackConfig);
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                reject('Build ' + config.projectName + 'failed with errors.\n');
                throw err.message;
            }
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
                chunks: false,
                chunkModules: false
            }) + '\n\n');
            if (stats.hasErrors()) {
                reject('Build ' + config.projectName + 'failed with errors.\n');
                process.exit(1);
            }
            resolve('Build ' + config.projectName + ' complete.\n');
        });
    });
};
module.exports = function nodeBuild (projectConfigs, env) {
    if (projectConfigs.length > 0) {
        rm(path.resolve(__dirname, '../unity/'), async err => {
            if (err) {
                throw err;
            }
            const rs = [];
            for (const config of projectConfigs) {
                try {
                    const r = await pw(config);
                    console.log(chalk.cyan(r));
                    rs.push(config.projectName);
                } catch (e) {
                    console.log(chalk.cyan(e));
                }
            }
            console.log(chalk.green('Build [' + rs.join() + '] completed'));
        });
    }
};
