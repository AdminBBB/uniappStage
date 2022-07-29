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
module.exports = {
    projectSourcePath: '', // user/myHomeIndex
    projectPath: 'digitalhome',
    projectName: '', //  myHomeIndex
    version: 'assets',//  1.0.0
    framework: 'react', // 'react'
    env: 'production', // 'production'
    rootHtml: 'index', // 'index' ||  ['index','page']
    pages: false, // 'page'
    client: 'mobile', // 'mobile'
    eGuardName: null, // 'eg'
    productionGzipExtensions: false,
    // devServer
    autoOpenPage: true,// 启动devServer 后是否自动打开浏览器
    errorOverlay: true,
    warningsOverlay: false,
    devHost: 'localhost',
    devbasePort: 8080, // 略
    proxyTable: {},
    webSocketURL: {},
    webSocketServer: 'ws', // 未经验证
    devCompress: true,
    devHttps: false,
    // devHttps: {
    //     key: fs.readFileSync('/path/to/server.key'),
    //     cert: fs.readFileSync('/path/to/server.crt'),
    //     ca: fs.readFileSync('/path/to/ca.pem')
    // },
    devHot: 'only',
    devHeaders: {},
    historyApiFallback: false
    // historyApiFallback: {
    //     rewrites: [ // 通过传递一个object来对该共呢个做更多的定
    //         { from: /^\/$/, to: '/views/landing.html' },
    //         { from: /^\/subpage/, to: '/views/subpage.html' },
    //         { from: /./, to: '/views/404.html' }
    //     ],
    //     disableDotRule: true // 当在路径中使用.符号，需要使用disableDotRule配置。
    // },
};
