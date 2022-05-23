const path = require('path');
const fs = require('fs');
/*
* getProjectNames 获取运行的项目名称
* @projectNamesArgvs {Array}  const命令行中获取的项目名称参数、
* */
module.exports = function (projectNamesArgv) {
    let projectNames = [],
        projectNamesResult = [];
    if (projectNamesArgv.length > 0) {
        projectNames = projectNamesArgv;
    } else {
        try {
            const data = fs.readFileSync(path.resolve(__dirname, '../.projectrc'), 'utf-8');
            projectNames = (data.split(/[\r|\n]/ig));
        } catch (e) {
            projectNames = [];
        }
    }
    projectNames.forEach(projectName => {
        projectName = projectName.trim();
        if (projectName && (/^[0-9a-zA-Z\/\\]*$/g).test(projectName)) {
            projectNamesResult.push(projectName);
        }
    });
    return projectNamesResult;
};
