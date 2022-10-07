/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/1/11.
 * Copyright 2021/1/11 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/1/11
 * @version */
import { Ax } from '@hjq/uts';
import { CONST_URL_LOGIN, AUTH_USERID, AUTH_TOKEN, viewModule, WEBID, MODULEID_SS } from './URL_AS.js';

Ax.setConfig({
    codeHandler: {
        401 () {
            viewModule(CONST_URL_LOGIN);
        },
        2000004 () {
            viewModule(CONST_URL_LOGIN);
        }
    },
    statusHandler: {
        401 () {
            viewModule(CONST_URL_LOGIN);
        },
        2000004 () {
            viewModule(CONST_URL_LOGIN);
        }
    }
});
if (AUTH_USERID && AUTH_TOKEN) {
    const header = {
        userId: AUTH_USERID,
        token: AUTH_TOKEN,
        webId: WEBID
    };
    if (MODULEID_SS) {
        header.moduleId = MODULEID_SS;
    }
    Ax.setConfig({ header });
} else {
    viewModule(CONST_URL_LOGIN);
}
export const _Ax = Ax;
export const userId = AUTH_USERID;

