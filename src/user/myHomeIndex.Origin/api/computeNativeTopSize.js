/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/7/6.
 * Copyright 2021/7/6 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/7/6
 * @version */
import { compareVersion } from '@hjq/uts';

export function computeNativeTopSize (phoneInfo) {
    const { OSType, phoneName, appVersion } = phoneInfo;
    let ptHeight = 44;// 默认安卓
    let ptBottom = 32; // 默认安卓
    let userInfoTopMb = 6; // 默认安卓
    /*
    * IOS 分析
    * */
    if (OSType.toLowerCase().includes('ios')) {
        const hasStraightBankKey = (['x', '11', '12', 'simulator']).some(k => {
            return phoneName.toLowerCase().includes(k);
        });
        ptHeight = hasStraightBankKey ? 88 : 64; // ios 齐刘海 88 vs 无刘海 64(针对老版本)
        userInfoTopMb = hasStraightBankKey ? 12 : 10;
    }
    // ios 且低于5.1.0的老版本，底部是76
    if (OSType.toLowerCase().includes('ios') && !compareVersion(appVersion, '5.1.0', true)) {
        ptBottom = 76;
    }
    /*
    * IOS 分析 end
    * */
    return {
        ptHeight,
        ptBottom,
        userInfoTopMb
    };
}
