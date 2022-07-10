const utils = require('./utils');
const fs = require('fs');
const chalk = require('chalk');
const { merge } = require('webpack-merge');
const defaultCustomConfig = require('./defaultCustomConfig');
/*
* getProjectConfigCustom 获取运行的项目的自定义参数项
* @projectNames {Array} 项目名称
* */
function getProjectConfigContent (projectEntryPath = '') {
    let projectSource = null;
    const projectPath = projectEntryPath ? `${projectEntryPath}/` : '';
    const jsonPath = utils.getProjectResPath(projectPath + 'config.json');
    const jsPath = utils.getProjectResPath(projectPath + 'config.js');
    if (fs.existsSync(jsonPath)) {
        projectSource = jsonPath;
    }
    if (fs.existsSync(jsPath)) {
        projectSource = jsPath;
    }
    return projectSource !== null ? require(projectSource) : {};
}
module.exports = function (projectEntryPaths, exCustomConfig) {
    let projectConfigs = [];
    if (Array.isArray(projectEntryPaths) && projectEntryPaths.length > 0) {
        for (const projectEntryPath of projectEntryPaths) {
            if (fs.existsSync(utils.getProjectResPath(projectEntryPath))) {
                const project = getProjectConfigContent(projectEntryPath);
                project.projectEntryPath = 'src/' + projectEntryPath;
                project.projectName = projectEntryPath.split(/\//ig).pop();
                projectConfigs.push(merge({}, defaultCustomConfig, project, exCustomConfig));
            } else {
                console.log(chalk.red('error:不存在的项目目录 -- ' + projectEntryPaths));
            }
        }
    } else {
        // 根目录在src的单页面项目
        const rootProject = fs.existsSync(utils.getProjectResPath(''));
        if (rootProject) {
            const project = getProjectConfigContent();
            project.projectName = project.projectEntryPath = 'root';
            projectConfigs.push(merge({}, defaultCustomConfig, project, exCustomConfig));
        } else {
            projectConfigs = [];
        }
    }
    return projectConfigs;
};
