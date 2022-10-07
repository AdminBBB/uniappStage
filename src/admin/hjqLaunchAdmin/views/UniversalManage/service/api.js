/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/17.
 * Copyright 2021/11/17 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/17
 * @version */
import { _Ax as Ax } from '../../../_PLATFORM_COMMON/Ax';

export function getproductTimesApi (options) {
    return Ax.request({
        url: '/resourceManage/timeManage/productTimes',
        method: 'post',
        data: JSON.stringify(options)
    });
}
export function getOperateTimesApi (options) {
    return Ax.request({
        url: '/resourceManage/timeManage/getOperateTimes',
        method: 'post',
        data: JSON.stringify(options)
    });
}
// 排期管理
export function reviewTime (params) {
    return Ax.request({
        url: '/resourceManage/timeManage/reviewTime',
        method: 'post',
        data: JSON.stringify(params)
    });
}
// 位置列表
///resourceManage/timeManage/getOperateTimeDetail
export function getOperateTimeDetailApi (id) {
    return Ax.request({
        url: '/resourceManage/timeManage/getOperateTimeDetail',
        method: 'post',
        data: JSON.stringify({ id })
    });
}
// /resourceManage/timeManage/addOperateTime
export function addOperateTimeApi () {
    return Ax.request({
        url: '/resourceManage/timeManage/addOperateTime',
        method: 'post'
    });
}

// 获取权限类型列表
// export function getAuthListApi () {
//     return Ax.request({
//         url: '/resourceManage/common/getAuthList',
//         method: 'post'
//     });
// }

// 权限列表搜索
export function searchAuthListApi (params) {
    return Ax.request({
        url: '/resourceManage/commonManage/searchAuthList',
        method: 'post',
        data: JSON.stringify(params)
    });
}

// 添加/编辑权限
export function getSaveAuthority (params) {
    return Ax.request({
        url: '/resourceManage/commonManage/saveAuthority',
        method: 'post',
        data: JSON.stringify(params)
    });
}

// 删除权限
export function getDeleteAuthority (params) {
    return Ax.request({
        url: '/resourceManage/commonManage/deleteAuthority',
        method: 'post',
        data: JSON.stringify(params)
    });
}

// 白名单列表搜索
export function searchWhiteListApi (params) {
    return Ax.request({
        url: '/resourceManage/commonManage/searchWhiteList',
        method: 'post',
        data: JSON.stringify(params)
    });
}

// 添加/更新白名单
export function getSaveWhiteList (params) {
    return Ax.request({
        url: '/resourceManage/commonManage/saveWhiteList',
        method: 'post',
        data: JSON.stringify(params)
    });
}

// 删除白名单
export function getDeleteWhiteList (params) {
    return Ax.request({
        url: '/resourceManage/commonManage/deleteWhiteList',
        method: 'post',
        data: JSON.stringify(params)
    });
}

// 超管审核列表搜索
export function searchAuditListApi (params) {
    return Ax.request({
        url: '/resourceManage/commonManage/searchAuditList',
        method: 'post',
        data: JSON.stringify(params)
    });
}

// 添加超管审核资源
export function getSaveAuditResource (params) {
    return Ax.request({
        url: '/resourceManage/commonManage/saveAuditResource',
        method: 'post',
        data: JSON.stringify(params)
    });
}

// 删除超管审核资源
export function getDeleteAuditResource (params) {
    return Ax.request({
        url: '/resourceManage/commonManage/deleteAuditResource',
        method: 'post',
        data: JSON.stringify(params)
    });
}
