/**
 * File Created by duanmingxue at 2021-05-18.
 * Copyright 2019 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author duanmingxue
 * @date 2021-05-18
 * @version */
import { Ax } from '@hjq/uts';

Ax.setConfig({
    forks: {
        401 () {
            // viewModule(CONST_URL_LOGIN);
        },
        2000004 () {
            // viewModule(CONST_URL_LOGIN);
        }
        /*209030 (e) {
            // 单点登录认证失败，特殊处理
            const loginType = window.localStorage.getItem('live_auth_loginType')||'0';
            if( loginType == '1' ){
                message.warn('登录信息失效，请返回大屏!');
            } else {
                //认证失败，重新登录
                const loginUrl = window.location.origin+window.location.pathname;
                setTimeout(()=>{
                    window.location = loginUrl;
                },100)
            }
        }*/
    }
});
const authUserCode = window.localStorage.getItem('live_auth_userCode') || '';
const authToken = window.localStorage.getItem('live_auth_token') || '';
if (authUserCode && authToken) {
    Ax.setConfig({
        header: {
            userCode: authUserCode,
            token: authToken
        }
    });
} else {
    // viewModule(CONST_URL_LOGIN);
}
export const _Ax = Ax;
