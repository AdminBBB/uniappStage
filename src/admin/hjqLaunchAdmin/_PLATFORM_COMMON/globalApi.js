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
import { AUTH_TOKEN, AUTH_USERID, CONST_URL_MAINMODULES, MODULEID_SS, MODULES_SS, WEB_INFO, WEBID } from './URL_AS';

export const getSSData = () => {
    return {
        userId: AUTH_USERID,
        token: AUTH_TOKEN,
        webId: WEBID,
        modules: MODULES_SS,
        webInfo: WEB_INFO
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
export function decomposeData (modules = [], moduleInfo = {}) {
    const { idKeyName = 'moduleId', orderId = 'id', parentIdKeyName = 'parentModuleId' } = moduleInfo;
    let modulesSort = Array.isArray(modules) ? modules.sort((m1, m2) => m1[orderId] - m2[orderId]) : [];
    const modulesMap = {};
    const moduleTree = {};
    for (const module of modulesSort) {
        modulesMap[module[idKeyName]] = module;
    }
    for (const module of modulesSort) {
        if (module[idKeyName]) { // 有的值是null
            const parentModule = parentIdKeyName && module[parentIdKeyName] && modulesMap[module[parentIdKeyName]];
            if (parentModule) {
                module.parentsPath = [...(parentModule.parentsPath || []), parentModule];
                parentModule.children = parentModule.children || {};
                parentModule.children[module[idKeyName]] = module;
            } else {
                module.parentsPath = [];
                moduleTree[module[idKeyName]] = module;
            }
        }
    }
    return {
        modulesSort,
        moduleTree,
        modulesMap
    };
}
