/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/7/13.
 * Copyright 2022/7/13 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/7/13
 * @version */
module.exports = function (config) {
    const { framework } = config;
    process.env.FRAMEWORK_TYPE = framework;
};
