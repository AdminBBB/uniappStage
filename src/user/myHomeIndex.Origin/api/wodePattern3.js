/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/17.
 * Copyright 2022/1/17 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/17
 * @version */
import AxRequest from './AxSetConfig';
import { Auth } from '@hjq/uts';
// 用户亲密豆数量
export function getBeanNumApi () {
    return AxRequest({
        url: `/qmd/bean/getBeanNum/${Auth.passId} `,
        method: 'get'
    });
}

export function getUserMode () {
    return AxRequest({
        url: `/base/user/getUserMode/${Auth.passId} `,
        method: 'post'
    });
}
