/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/16.
 * Copyright 2021/11/16 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/16
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { COMMON_CONTEXT } from '../store';

export function useUtils () {
    const { state: { currentLauncherData, authType } } = useContext(COMMON_CONTEXT);
    const handlers = {
        ResourceCateMatch (resouceName) {
            let _resource = { orders: [], location: '', minDateUnit: '' };
            if (currentLauncherData) {
                const { resourceInfoList } = currentLauncherData;
                const resourceFd = resourceInfoList.find(r => r.resourceName === resouceName);
                Object.assign(_resource, resourceFd || {});
            }
            return _resource;
        },
        ar (rights) {
            return rights.includes(authType);
        }
    };
    return (type, ...data) => {
        return handlers[type](...data);
    };
}
