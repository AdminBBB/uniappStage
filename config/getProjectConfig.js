const utils = require('./utils');
const fs = require('fs');
const chalk = require('chalk');
const { merge } = require('webpack-merge');
const defaultCustomConfig = require('./defaultCustomConfig');
/*
* getProjectConfigCustom 获取运行的项目的自定义参数项
* @projectNames {Array} 项目名称
* */
function getProjectConfigContent (projectSourcePath = '') {
    let projectSource = null;
    const projectPath = projectSourcePath ? `${projectSourcePath}/` : '';
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
module.exports = function (projectSourcePaths, exCustomConfig) {
    let projectConfigs = [];
    if (Array.isArray(projectSourcePaths) && projectSourcePaths.length > 0) {
        for (const projectSourcePath of projectSourcePaths) {
            if (fs.existsSync(utils.getProjectResPath(projectSourcePath))) {
                const project = getProjectConfigContent(projectSourcePath);
                project.projectSourcePath = projectSourcePath;
                project.projectName = projectSourcePath.split(/\//ig).pop();
                projectConfigs.push(merge({}, defaultCustomConfig, project, exCustomConfig));
            } else {
                console.log(chalk.red('error:不存在的项目目录 -- ' + projectSourcePaths));
            }
        }
    } else {
        // 根目录在src的单页面项目
        const rootProject = fs.existsSync(utils.getProjectResPath(''));
        if (rootProject) {
            const project = getProjectConfigContent();
            project.projectName = project.projectSourcePath = 'root';
            projectConfigs.push(merge({}, defaultCustomConfig, project, exCustomConfig));
        } else {
            projectConfigs = [];
        }
    }
    return projectConfigs;
};
