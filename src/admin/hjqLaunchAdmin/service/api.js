/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/11.
 * Copyright 2021/11/11 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/11
 * @version */
import { _Ax as Ax } from '../../_PLATFORM_COMMON/Ax';
import { popIndexToUnshift, handleFilter, handleRes } from './utils';
import { AUTH_TYPE_MAP } from '../common/CONSTANT';
/*
*
* 用户权限
*
* */
export async function getUserAuthListApi () {
    try {
        const authType = await Ax.request({
            url: '/resourceManage/user/getUserAuthList',
            method: 'post'
        });
        return Array.isArray(authType) ? authType : [];
    } catch (e) {
        return [];
    }
}
/*
*
* 获取网站依赖信息
*
* */
// 获取获取省份列表
export function getProvinceList () {
    return Ax.request({
        url: '/resourceManage/common/getProvinceList',
        method: 'post'
    });
}
// 获取获取省市列表
export function getCityList () {
    return Ax.request({
        url: '/resourceManage/common/getCityList',
        method: 'post'
    });
}
// 获取部门、版本列表，数据类型 1：部门 2：版本
export function getDataListDep (type) {
    return Ax.request({
        url: '/resourceManage/common/getDataList/' + `${type}`,
        method: 'post'
    });
}
// 获取所有资源库信息
export function getResources () {
    return Ax.request({
        url: '/resourceManage/config/getResources',
        method: 'get'
    });
}
// 获取权限类型列表
export function getAuthListApi () {
    return Ax.request({
        url: '/resourceManage/common/getAuthList',
        method: 'post'
    });
}
// 获取样式pattern信息
export function getPatternList () {
    return Ax.request({
        url: '/resourceManage/common/getPatternList',
        method: 'post'
    });
}
export const getDependsData = async () => {
    try {
        const promiseAll = [
            getProvinceList(),
            getDataListDep(1),
            getDataListDep(2),
            getCityList(),
            getResources(),
            getPatternList(),
            getUserAuthListApi(),
            getAuthListApi()
        ];
        let [r1, r2, r3, r4, r5, r6, _authType, _authTypeList] = await Promise.all(promiseAll);
        /* AUTH TYPE { */
        // _authType = [];
        _authTypeList.push({ authName: '其他', authType: 99 });
        const authTypeList = [];
        const authTypeMap = {};
        const localauthTypeMap = {};
        const __authType = Array.isArray(_authType) ? (typeof _authType[0] !== 'undefined' ? _authType[0] : 99) : Number((_authType || _authType === 0) ? _authType : 99);
        // const __authType = 4;
        for (const authTypeListElement of _authTypeList) {
            const { authName, authType } = authTypeListElement;
            const { l: localauthType, c: authTypeClass } = AUTH_TYPE_MAP[authType];
            const _authTypeAs = { localauthType, authType, authName, authTypeClass };
            authTypeList.push(_authTypeAs);
            localauthTypeMap[localauthType] = authTypeMap[authType] = _authTypeAs;
        }
        const { authTypeClass, localauthType, authName } = authTypeMap[__authType];
        /* } AUTH TYPE END */
        const LcrDependencesData = {};
        LcrDependencesData.provinceList = popIndexToUnshift(r1);
        LcrDependencesData.depList = r2;
        LcrDependencesData.versionList = (r3 || []).reverse();
        LcrDependencesData.cityList = popIndexToUnshift(r4);
        LcrDependencesData.resourceMsg = r5;
        LcrDependencesData.resourceMsgSuper = handleRes(r5);
        LcrDependencesData.depListFilter = handleFilter(r2);
        LcrDependencesData.versionListFilter = handleFilter(r3);
        LcrDependencesData.patternList = r6;
        LcrDependencesData.regionsMap = (() => {
            const regionsMap = {};
            for (const cityListElement of LcrDependencesData.cityList) {
                const {
                    cityList = [],
                    provCode,
                    provName
                } = cityListElement;
                regionsMap[provCode] = provName;
                for (const cityListElement1 of cityList) {
                    const { cityName, cityCode } = cityListElement1;
                    regionsMap[cityCode] = cityName;
                }
            }
            return regionsMap;
        })();
        return {
            LcrDependencesData,
            authTypeList, authTypeMap, localauthTypeMap,
            authType: __authType,
            authTypeClass,
            localauthType, authName
        };
    } catch (e) {
        throw e;
    }
};
// 获取条目详情
export function getItemDetail (itemId) {
    return Ax.request({
        url: '/resourceManage/itemManage/itemDetail',
        method: 'post',
        data: JSON.stringify({ itemId })
    });
}
// 获取资源位审核信息
export function getReviewDetailApi (params) {
    return Ax.request({
        url: '/resourceManage/itemManage/getReviewDetail',
        method: 'post',
        data: JSON.stringify(params)
    });
}
// 用户文件上传
export function uploadSpecificUserFile (data) {
    let fm = new FormData();
    fm.append('file', data);
    return Ax.request({
        url: '/resourceManage/common/uploadSpecificUserFile',
        method: 'post',
        data: fm
    });
}
/*
*
* 投放管理列表 相关操作
*
* */
export function getItemListApi (params) {
    return Ax.request({
        url: '/resourceManage/itemManage/getItemList',
        method: 'post',
        data: JSON.stringify(params)
    });
}
// 删除条目
export function deleteItem (params) {
    return Ax.request({
        url: '/resourceManage/itemManage/deleteItem',
        method: 'post',
        data: JSON.stringify(params)
    });
}
// 开启/关闭白名单，1：开启白名单 0：关闭白名单
export function updateGrayStatus (params) {
    return Ax.request({
        url: '/resourceManage/itemManage/updateGrayStatus',
        method: 'post',
        data: JSON.stringify(params)
    });
}
// 条目上下线
export function onOffLine (params) {
    return Ax.request({
        url: '/resourceManage/itemManage/onOffLine',
        method: 'post',
        data: JSON.stringify(params)
    });
}
// 获取变更日志
export function getOperationLogs (params) {
    return Ax.request({
        url: '/resourceManage/itemManage/getOperationLogs',
        method: 'post',
        data: JSON.stringify(params)
    });
}
/*
* 编辑投放管理类
* */
// 投放申请-保存
export function saveItemApi (params) {
    return Ax.request({
        url: '/resourceManage/itemManage/saveItem',
        method: 'post',
        data: JSON.stringify(params)
    });
}
// 投放申请-提交
export function commitItemApi (params) {
    return Ax.request({
        url: '/resourceManage/itemManage/commitItem',
        method: 'post',
        data: JSON.stringify(params)
    });
}
// 资源-删除
export function deleteResource (resourceId) {
    return Ax.request({
        url: '/resourceManage/resource/deleteResource',
        method: 'post',
        data: JSON.stringify({ resourceId })
    });
}
// 资源-编辑触发类
export function editResource (data) {
    return Ax.request({
        url: '/resourceManage/resource/editResource',
        method: 'post',
        data
    });
}
// 图片资源上传
export function uploadPhoto (data) {
    let fm = new FormData();
    fm.append('photo', data.photo);
    fm.append('isCompress', data.isCompress);
    fm.append('proCode', data.proCode);
    return Ax.request({
        url: `/resourceManage/common/uploadPhoto/${data.proCode}`,
        method: 'post',
        data: fm
    });
}
// 推送-白名单用户上传
export function uploadWhiteUserFile (data) {
    let fm = new FormData();
    fm.append('file', data);
    return Ax.request({
        url: '/resourceManage/common/uploadWhiteUserFile',
        method: 'post',
        data: fm
    });
}
// 资源-推送测试
export function testPush (data) {
    return Ax.request({
        url: '/resourceManage/resource/testPush',
        method: 'post',
        data
    });
}
// 资源审核
export function reviewResourceApi (data) {
    return Ax.request({
        url: '/resourceManage/itemManage/reviewResource',
        method: 'post',
        data
    });
}
/*
*
*
* 排期管理
*
*
* */
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
export function reviewTimeApi (params) {
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
        data: JSON.stringify({ id: Number(id) })
    });
}
// /resourceManage/timeManage/addOperateTime
export function addOperateTimeApi () {
    return Ax.request({
        url: '/resourceManage/timeManage/addOperateTime',
        method: 'post'
    });
}
export function saveResourceTimesApi (data) {
    return Ax.request({
        url: '/resourceManage/timeManage/saveResourceTimes',
        method: 'post',
        data
    });
}
export function deleteOperateTimeApi (id) {
    return Ax.request({
        url: '/resourceManage/timeManage/deleteOperateTime',
        method: 'post',
        data: { id }
    });
}
export function deleteResourceUnitApi (unitId) {
    return Ax.request({
        url: '/resourceManage/resource/deleteResourceUnit',
        method: 'post',
        data: { unitId }
    });
}
