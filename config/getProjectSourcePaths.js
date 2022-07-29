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
const path = require('path');
const fs = require('fs');
/*
* getProjectNames 获取运行的项目名称
* @projectNamesArgvs {Array}  const命令行中获取的项目名称参数、
* */
module.exports = function (projectSourcePathsFromArgv) {
    let projectSourcePaths = [],
        projectSourcePathsResolve = [];
    if (projectSourcePathsFromArgv?.length > 0) {
        projectSourcePaths = projectSourcePathsFromArgv.split(',');
    } else {
        try {
            const data = fs.readFileSync(path.resolve(__dirname, '../.projectrc'), 'utf-8');
            projectSourcePaths = (data.split(/[\r|\n]/ig));
        } catch (e) {
            projectSourcePaths = [];
        }
    }
    projectSourcePaths.forEach(projectName => {
        projectName = projectName.trim();
        if (projectName && (/^[0-9a-zA-Z\/\\]*$/g).test(projectName)) {
            projectSourcePathsResolve.push(projectName);
        }
    });
    return projectSourcePathsResolve;
};
