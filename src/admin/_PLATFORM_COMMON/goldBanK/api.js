/*
 * @Description: 
 * @Author: zhangtingting
 * @Date: 2021-08-17 15:25:26
 * @LastEditTime: 2021-10-08 10:12:13
 * @LastEditors: zhangtingting
 */
/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/7/16.
 * Copyright 2021/7/16 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/7/16
 * @version */
import { _Ax as Ax } from '../Ax';
/**
 * 金库认证信息获取
 * @param {Object} data 
 * menuCode 菜单标识
 * @returns 
 */
export function getGlodAuthInfo (data) {
    return Ax.request({
        url: '/auth_web/glod/getGlodAuthInfo',
        method: 'post',
        data
    });
}
/**
 * 金库二次认证
 * @param {Object} data 
 * glodToken 金库认证token
 * operCode 金库认证操作码
 * @returns 
 */
export function glodTokenAuth (data) {
    return Ax.request({
        url: '/auth_web/glod/glodTokenAuth',
        method: 'post',
        data
    });
}
