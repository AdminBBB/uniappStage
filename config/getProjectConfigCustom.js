const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
module.exports = function (projectNames, otherObj) {
    let projectConfigs = [];
    const projectPath = function (propath) {
        return path.resolve(__dirname, '../src/' + propath);
    };
    if (projectNames.length > 0) {
        for (const prjectName of projectNames) {
            if (fs.existsSync(projectPath(prjectName))) {
                let project = {};
                const jsonPath = projectPath(prjectName + '/' + 'config.json');
                const jsPath = projectPath(prjectName + '/' + 'config.js');
                project = fs.existsSync(jsonPath) ? require(jsonPath) : (fs.existsSync(jsPath) ? require(jsPath) : {});
                project.projectName = project.projectName || prjectName;
                project.publicProjectName = (function () {
                    const prnamesStr = project.projectName.replace(/[\/\\]/ig, '||');
                    const prnames = prnamesStr.split('||');
                    return prnames[prnames.length - 1];
                })();
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
