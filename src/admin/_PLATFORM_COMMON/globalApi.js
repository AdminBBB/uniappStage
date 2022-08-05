/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/8/12.
 * Copyright 2021/8/12 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/8/12
 * @version */
import { getSpParam } from '@hjq/uts';
import { CONST_URL_MAINMODULES, getSS, WEBID } from './URL_AS';

export const getSSData = () => {
    return {
        userId: getSS('mio_auth_userId'),
        token: getSS('mio_auth_token'),
        webId: getSS('mio_auth_webId'),
        modules: getSS('mio_auth_modules'),
        loginType: getSS('mio_auth_loginType')
    };
};
export function setAuthSesstion (ssData) {
    for (const sd of Object.entries(ssData)) {
        const [k, v] = sd;
        let value = v;
        try {
            if (typeof v === 'string') {
                value = v;
            } else {
                value = JSON.stringify(v);
            }
        } catch (e) {
            value = v;
        }
        window.sessionStorage.setItem(`mio_auth_${k}`, value);
    }
}
export const getPlatformName = async (webid = WEBID) => {
    let title, url;
    try {
        const KV_PARAMS = await getSpParam({ RD_KEY: 'moduleIoAdminTitle' });
        const WEB_INFO = KV_PARAMS?.[webid];
        title = WEB_INFO?.title || webid.toUpperCase();
        url = WEB_INFO?.url || CONST_URL_MAINMODULES;
    } catch (e) {
        title = webid;
        url = CONST_URL_MAINMODULES;
    }
    document.title = title;
    return { title, url };
};
