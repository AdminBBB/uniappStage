const chalk = require('chalk');
/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/9/21.
 * Copyright 2022/9/21 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/9/21
 * @version */
module.exports = function (msg) {
    console.log(chalk.red(`************ error ************`));
    console.log(chalk.red(msg.join('\n')));
    console.log(chalk.red(`************ error ************\n `));
    process.exit(1);
};
