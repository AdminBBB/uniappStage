/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/7/19.
 * Copyright 2022/7/19 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/7/19
 * @version */
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');
const { merge } = require('webpack-merge');
const webpackConfigDev = require('./webpackConfig.dev');
const webpackConfigBasic = require('./webpackConfig.basic');
module.exports = function (config) {
    const webpackConfig = merge(webpackConfigBasic(config), webpackConfigDev(config));
    const preCongfig = new Promise((resolve, reject) => {
        if (config && webpackConfig) {
            process.env.PROJECT_CLIENT = config.client;
            process.env.FRAMEWORK_TYPE = config.framework = config.framework || 'react';
            const devOptions = {
                // clientLogLevel: 'error',
                // contentBase: false,
                host: 'localhost', // can be overwritten by process.env.HOST
                port: 8080,
                open: config.autoOpenBrowser,
                // hot: true,
                // inline: true,
                // quiet: true,//当启用该配置，除了初始化信息会被写到console中，其他任何信息都不会被写进去。errors和warnings也不会被写到console中。
                // noInfo: true, // 启用noInfo，类似webpack bundle启动或保存的信息将会被隐藏，Errors和warnings仍会被显示。
                compress: true,//是否启用gzip压缩
                proxy: config.proxyTable,
                // 在浏览器上全屏显示编译的errors或warnings。
                headers: config.headers
                // historyApiFallback: {
                //     rewrites: [
                //         { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }
                //     ]
                // },
            };
            portfinder.basePort = process.env.PORT || config.devPort;
            portfinder.getPort((err, port) => {
                if (err) {
                    reject(err);
                } else {
                    process.env.PORT = port;// publish the new Port, necessary for e2e tests
                    devOptions.port = port; // add port to server config
                    resolve({ webpackConfig, devOptions });
                }
            });
        } else {
            reject(chalk.red('config error:配置信息错误'));
        }
    });
    preCongfig.then((res) => {
        console.log(res);
        const server = new WebpackDevServer(webpack(res.webpackConfig), res.devOptions);
        server.listen(res.devOptions.port, config.host, () => {
            console.log(chalk.red(`Your application is running here:  `));
        });
    }).catch((e) => {
        console.log(e);
    });
};
