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
const utils = require('./utils');
const fs = require('fs');
const chalk = require('chalk');
const { merge } = require('webpack-merge');
const defaultCustomConfig = require('./defaultCustomConfig');
/*
* getProjectConfigCustom 获取运行的项目的自定义参数项
* @projectNames {Array} 项目名称
* */
function getProjectConfigContent (_projectSourcePath = '', exCustomConfig = {}) {
    let projectSource = null;
    const projectSourcePath = _projectSourcePath || '';
    const jsonPath = utils.getProjectResPath(projectSourcePath + '/config.json');
    const jsPath = utils.getProjectResPath(projectSourcePath + '/config.js');
    if (fs.existsSync(jsonPath)) {
        projectSource = jsonPath;
    }
    if (fs.existsSync(jsPath)) {
        projectSource = jsPath;
    }
    const projectConfigCustom = projectSource !== null ? require(projectSource) : {};
    projectConfigCustom.projectSourcePath = projectSourcePath;
    projectConfigCustom.projectName = projectSourcePath.split(/\//ig).pop();
    const project = merge({}, defaultCustomConfig, projectConfigCustom, exCustomConfig);
    const { projectPath, projectName, versionBasicPath, version } = project;
    project.outPutPath = projectPath + '/' + projectName + '/' + (versionBasicPath ? version : '');
    project.assetsPath = versionBasicPath ? 'assets' : version;
    return project;
}
module.exports = function (projectSourcePaths, exCustomConfig) {
    let projectConfigs = [];
    if (Array.isArray(projectSourcePaths) && projectSourcePaths.length > 0) {
        for (const projectSourcePath of projectSourcePaths) {
            if (fs.existsSync(utils.getProjectResPath(projectSourcePath))) {
                projectConfigs.push(getProjectConfigContent(projectSourcePath, exCustomConfig));
            } else {
                console.log(chalk.red(`*************** error *******************`));
                console.log(chalk.red(`  不存在的项目目录 : ${projectSourcePaths} `));
                console.log(chalk.red(`*****************************************\n `));
            }
        }
    } else {
        // 根目录在src的单页面项目
        const rootProject = fs.existsSync(utils.getProjectResPath(''));
        if (rootProject) {
            projectConfigs.push(getProjectConfigContent('', exCustomConfig));
        } else {
            projectConfigs = [];
        }
    }
    return projectConfigs;
};
