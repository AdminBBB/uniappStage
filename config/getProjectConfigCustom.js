const utils = require('./utils');
const fs = require('fs');
const chalk = require('chalk');
/*
* getProjectConfigCustom 获取运行的项目的自定义参数项
* @projectNames {Array} 项目名称
* */
function getProjectConfigContent (projectName = '') {
    let projectSource = null;
    const projectPath = projectName ? '' : `${projectName}/`;
    const jsonPath = utils.getProjectPath(projectPath + 'config.json');
    const jsPath = utils.getProjectPath(projectPath + 'config.js');
    if (fs.existsSync(jsonPath)) {
        projectSource = jsonPath;
    }
    if (fs.existsSync(jsPath)) {
        projectSource = jsPath;
    }
    return projectSource !== null ? require(projectSource) : {};
}
module.exports = function (projectNames, exCustomConfig) {
    let projectConfigs = [];
    if (Array.isArray(projectNames) && projectNames.length > 0) {
        for (const prjectName of projectNames) {
            if (fs.existsSync(utils.getProjectPath(prjectName))) {
                const project = getProjectConfigContent(prjectName);
                project.projectName = project.projectName || prjectName;
                project.projectBaseName = project.projectName.split(/\//ig).pop();
                projectConfigs.push(Object.assign(project, exCustomConfig));
            } else {
                console.log(chalk.red('error:不存在的项目目录 -- ' + prjectName));
            }
        }
    } else {
        // 根目录在src的单页面项目
        const rootProject = fs.existsSync(utils.getProjectPath(''));
        if (rootProject) {
            const project = getProjectConfigContent();
            project.projectName = project.projectBaseName = 'root';
            projectConfigs.push(Object.assign(project, exCustomConfig));
        } else {
            projectConfigs = [];
        }
    }
    return projectConfigs;
};
