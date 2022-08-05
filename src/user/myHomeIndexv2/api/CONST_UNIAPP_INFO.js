/*
 * @Description: 
 * @Author: zhangtingting
 * @Date: 2022-02-23 09:53:08
 * @LastEditTime: 2022-02-23 16:55:02
 * @LastEditors: zhangtingting
 */
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

export const DEFAULT_AVATAR_BASE64 = 'data:image/png;base64,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';
export const CONST_USER_INFO = {
    mobileNumber: '18867102759',
    nickname: '和家亲_用户',
    headImg: DEFAULT_AVATAR_BASE64,
    cityCode: '330100',
    provCode: '42',
    userSelectCityCode: '',
    userSelectProvinceCode: '42'
};
export const CONST_UNIAPP_INFO = {
    appVersion: '6.2.0',
    OSType: 'ios',
    OSversion: '14.0.1',
    phoneName: 'iphone 12'
};

