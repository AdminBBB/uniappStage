/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/7/28.
 * Copyright 2022/7/28 CMCC Corporation Limited. * All rights reserved.
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
import { URLParser } from '@hjq/uts';

const pro = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(2);
    }, 300);
});
(async () => {
    try {
        const t = await pro;
        alert(t);
        alert(URLParser().url);
    } catch (e) {
    }
})();
