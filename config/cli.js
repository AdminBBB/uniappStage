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
const getProjectSourcePaths = require('./getProjectSourcePaths.js');
const getProjectConfig = require('./getProjectConfig');
const nodeBuild = require('./node.build');
const nodeServer = require('./node.server');
/*
* 解析 node 参数
* npm run dev admin/esDemo,user/userDemo ==> env:'development', projectSourcePathsFromArgv:admin/esDemo,user/userDemo
* */
const [env, projectSourcePathsFromArgv] = process.argv.slice(2);
/*
* getProjectNames 根据参数  获取运行的项目名称
* ['admin/esDemo','user/userDemo']
* */
const projectSourcePaths = getProjectSourcePaths(projectSourcePathsFromArgv);
/*
* getProjectConfigCustom 获取运行的项目的自定义参数项
* */
const projectConfigs = getProjectConfig(projectSourcePaths, { env });
/*
* 获取webpack配置信息  获取项目配置
* */
switch (env) {
    case 'production':
        nodeBuild(projectConfigs);
        break;
    case 'development':
        nodeServer(projectConfigs[0]);
        break;
}
