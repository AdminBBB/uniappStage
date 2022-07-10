const path = require('path');
const fs = require('fs');
/*
* getProjectNames 获取运行的项目名称
* @projectNamesArgvs {Array}  const命令行中获取的项目名称参数、
* */
module.exports = function (projectEntryPathsFromArgv) {
    let projectEntryPaths = [],
        projectEntryPathsResolve = [];
    if (projectEntryPathsFromArgv?.length > 0) {
        projectEntryPaths = projectEntryPathsFromArgv.split(',');
    } else {
        try {
            const data = fs.readFileSync(path.resolve(__dirname, '../.projectrc'), 'utf-8');
            projectEntryPaths = (data.split(/[\r|\n]/ig));
        } catch (e) {
            projectEntryPaths = [];
        }
    }
    
    projectEntryPaths.forEach(projectName => {
        projectName = projectName.trim();
        if (projectName && (/^[0-9a-zA-Z\/\\]*$/g).test(projectName)) {
            projectEntryPathsResolve.push(projectName);
        }
    });
    return projectEntryPathsResolve;
};
