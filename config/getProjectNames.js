/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/5/22.
 * Copyright 2022/5/22 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/5/22
 * @version
 * */
const path = require('path');
const fs = require('fs');
module.exports = function (projectNamesArgv) {
    let projectNames = [], projectNamesResult = [];
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
