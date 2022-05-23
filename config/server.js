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
 * @version */
const getProjectNames = require('./getProjectNames.js');
const getProjectConfigCustom = require('./getProjectConfigCustom');
const [env, ...projectNamesArgv] = process.argv.slice(2);
const projectNames =  getProjectNames(projectNamesArgv);
console.log(projectNames);
const projectConfigCustom = getProjectConfigCustom(projectNames,{env});
console.log(projectConfigCustom);
