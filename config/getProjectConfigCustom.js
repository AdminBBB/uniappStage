const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const _projectPath = function (propath) {
    return path.resolve(__dirname, '../src/' + propath);
};
/*
* getProjectConfigCustom 获取运行的项目的自定义参数项
* @projectNames {Array} 项目名称
* */
module.exports = function (projectNames, otherObj) {
    let projectConfigs = [];
    if (Array.isArray(projectNames) && projectNames.length > 0) {
        for (const prjectName of projectNames) {
            if (fs.existsSync(_projectPath(prjectName))) {
                let projectSource = null, project = {};
                const jsonPath = _projectPath(prjectName + '/' + 'config.json');
                const jsPath = _projectPath(prjectName + '/' + 'config.js');
                if (fs.existsSync(jsonPath)) {
                    projectSource = jsonPath;
                }
                if (fs.existsSync(jsPath)) {
                    projectSource = jsPath;
                }
                if (projectSource !== null) {
                    project = require(projectSource);
                }
                project.projectName = project.projectName || prjectName;
                project.projectBaseName = project.projectName.split(/\//ig).pop();
                projectConfigs.push(Object.assign(project, otherObj));
            } else {
                console.log(chalk.red(prjectName + ':不存在该项目目录'));
            }
        }
    } else {
        projectConfigs = null;
    }
    return projectConfigs;
};
