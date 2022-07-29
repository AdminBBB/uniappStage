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
const FriendlyErrorsPlugin = require('@soda/friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const { merge } = require('webpack-merge');
const webpackConfigDev = require('./webpackConfig.dev');
const webpackConfigBasic = require('./webpackConfig.basic');
module.exports = function (config) {
    const webpackConfig = merge(webpackConfigBasic(config), webpackConfigDev(config));
    const proxyTable = {};
    Object.entries((config?.proxy ?? {})).forEach(proxyItem => {
        const [apiKey, apiValue] = proxyItem;
        proxyTable[apiKey] = {
            target: apiValue,
            host: apiValue,
            changeOrigin: true,
            secure: false
        };
    });
    const preCongfig = new Promise((resolve, reject) => {
        if (config && webpackConfig) {
            const devOptions = {
                host: config.devHost, // can be overwritten by process.env.HOST
                open: typeof config.autoOpenPage === 'string' ? [config.autoOpenPage] : config.autoOpenPage,
                client: {
                    logging: 'error',
                    overlay: config.errorOverlay,
                    progress: true,
                    webSocketTransport: config.webSocketServer,
                    webSocketURL: config.webSocketURL
                },
                webSocketServer: config.webSocketServer,
                https: config.https,
                headers: config.headers,
                compress: config.devCompress,//是否启用gzip压缩
                proxy: proxyTable,
                historyApiFallback: config.historyApiFallback,
                hot: true
            };
            portfinder.basePort = config.devbasePort;
            portfinder.getPort((err, port) => {
                if (err) {
                    reject(err);
                } else {
                    // publish the new Port, necessary for e2e tests
                    devOptions.port = port; // add port to server config
                    webpackConfig.plugins.push(new FriendlyErrorsPlugin({// Add FriendlyErrorsPlugin
                        compilationSuccessInfo: {
                            messages: [`Your application is running here:${chalk.green.bold(`\t${config.devHost}:${port}`)}`]
                        },
                        clearConsole: true
                    }));
                    resolve({ webpackConfig, devOptions });
                }
            });
        } else {
            reject(chalk.red('config error:配置信息错误'));
        }
    });
    preCongfig.then((res) => {
        const server = new WebpackDevServer(res.devOptions, webpack(res.webpackConfig));
        server.start();
    }).catch((e) => {
        console.log(e);
    });
};
