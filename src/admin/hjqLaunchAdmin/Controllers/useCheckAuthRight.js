/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/8/22.
 * Copyright 2022/8/22 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/8/22
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { COMMON_CONTEXT } from '../store';

export function useCheckAuthRight () {
    const { state: { localAuthType, authType, authTypeClass, userInfo: { userName } } } = useContext(COMMON_CONTEXT);
    return {
        checkAuthRight (rights, isInclude = 0) {
            const rightAr = Array.isArray(rights) ? rights : [rights];
            switch (isInclude) {
                case 0:// 其中有一个权限匹配要求权限的一个即可
                    return localAuthType.some(a => rightAr.includes(a));
                case 1:// 其中有一个权限不匹配要求权限的一个即可
                    return localAuthType.some(a => !rightAr.includes(a));
            }
        },
        checkCreateBy (createBy, ignoreClass = ['admin']) {
            const isIgnoreClass = authTypeClass.some(a => ignoreClass.includes(a));
            if (isIgnoreClass) {
                return true;
            } else {
                return userName === createBy;
            }
        },
        checkAuthClass (authClass) {
            return authTypeClass.some(a => authClass.includes(a));
        },
        checkRight (permittedAuthRight = [], itemType = -1, createBy = null) {
            const permittedAuthRightResolve = [0, ...permittedAuthRight];
            if (authType.some(a => permittedAuthRightResolve.includes(a))) {
                return true;
            } else {
                //itemType 值不存在 则表示只有 ignoreAuthRightResolve 才有权限操作
                // itemType 99  则表示任何人都可以操作
                // createBy 的值不存在，则表示只有管理可以操作
                switch (itemType) {
                    case 99:
                        return true;
                    case 0:
                        return authType.includes(2) || (createBy && authType.includes(4) && createBy === userName);
                    case 1:
                        return authType.includes(3) || (createBy && authType.includes(5) && createBy === userName);
                    case 10:
                        return [2, 4].some(a => authType.includes(a)) && [3, 5].some(a => authType.includes(a));
                    default:
                        return false;
                }
            }
        }
    };
}
