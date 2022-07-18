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
                console.log(chalk.red('error:不存在的项目目录 -- ' + projectSourcePaths));
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
