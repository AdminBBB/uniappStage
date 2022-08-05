/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/10.
 * Copyright 2021/11/10 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/10
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { message, Modal } from 'antd';
import { getUUID } from '@hjq/uts';
import { COMMON_CONTEXT } from '../store';
import { reviewTimeApi, getItemDetail, getItemListApi, commitItemApi, deleteResource, saveItemApi, onOffLine, updateGrayStatus, getReviewDetailApi, reviewResourceApi } from '../service/api';
import { DEFAULT_CURRENT_DATA, DEFAULT_CURRENT_LAUNCHER_DATA, ITEM_TYPE_CONFIGNAME } from '../common/CONSTANT';
import { RESOURCE_STYLE_CONFIG } from '../common/RESOURCE_STYLE_CONFIG';
import { mkDefArray } from '../service/utils';
import { RESOURCE_MAP } from '../common/RESOURCE_MAP';

export function useLcrMngOperaters () {
    const { state, dispatch } = useContext(COMMON_CONTEXT);
    const {
        operateType, authTypeClass, localauthType, LcrDependencesData
    } = state;
    const { resourceMsg } = LcrDependencesData;
    const handlers = {
        // 投放列表获取
        async getLauncherMagList (options = {}) {
            const { LcrTablePageNo, LcrTablePageSize, LauncherFilterKeyWord } = state;
            const { keyWord = LauncherFilterKeyWord } = options;
            dispatch({
                rsmTableLoading: true
            });
            try {
                const requestData = Object.assign({ page: LcrTablePageNo, size: LcrTablePageSize }, { keyWord: keyWord }, options);
                if ([2, 4].includes(localauthType)) {
                    requestData.itemType = 0;
                }
                if ([3, 5].includes(localauthType)) {
                    requestData.itemType = 1;
                }
                const { data, total } = await getItemListApi(requestData);
                dispatch({
                    LauncherData: data, LauncherDataTotal: total, LauncherFilterKeyWord: keyWord, LcrTablePageSize: requestData.size, LcrTablePageNo: requestData.page, LcrTableLoading: false
                });
            } catch (e) {
                message.error(e.message);
            }
        }, // 投放列表操作--上-下线
        switchOnline (record, operateType) {
            const operateTypeTxt = ['下线', '上线'][operateType];
            const that = this;
            let params = {
                itemId: record.itemId, operateType
            };
            Modal.confirm({
                title: `确定要${operateTypeTxt}吗`, content: '', okText: '确定', cancelText: '取消', async onOk () {
                    try {
                        await onOffLine(params);
                        message.success(`${operateTypeTxt}成功`);
                        await that.getLauncherMagList();
                    } catch (err) {
                        message.error(err?.message ?? '操作失败，请稍后再试');
                    }
                }
            });
        }, // 投放列表操作--    //开启、关闭白名单
        async grayStatusEdit (record) {
            const that = this;
            let params = {
                itemId: record.itemId, grayStatus: record.grayStatus === 1 ? 0 : 1
            };
            try {
                await updateGrayStatus(params);
                message.success('操作成功');
                await that.getLauncherMagList();
            } catch (e) {
                message.error(e?.message ?? '操作失败，请稍后再试');
            }
        }, // 创建&修改投放对象
        /*
        * @type
        * */
        async setCurrentLauncherData (itemId, _operateType = operateType) {
            _operateType = Number(_operateType);
            try {
                const NEW_DEFAULT_CURRENT_DATA = Object.assign({}, DEFAULT_CURRENT_DATA);
                let _currentLauncherData = itemId === 'add' ? NEW_DEFAULT_CURRENT_DATA : (await getItemDetail(itemId));
                /*
                * 变换 currentLauncherData 以适应表单类型 { = START
                * */
                _currentLauncherData.tagTxt = (_currentLauncherData?.tagType === 2) ? (_currentLauncherData?.tag ?? '') : '';
                if (_operateType === 11) { // 11 复制
                    const __currentLauncherData = {};
                    const copyKeys = ['itemType', 'itemName', 'department', 'regionCode', 'provCode', 'system', 'minVersion', 'maxVersion', 'tagType', 'tagTxt', 'itemNote', 'tag'];
                    for (const key of copyKeys) {
                        __currentLauncherData[key] = _currentLauncherData[key];
                    }
                    _currentLauncherData = __currentLauncherData;
                }
                const { itemType = _operateType, provCode, regionCode } = _currentLauncherData;
                _currentLauncherData.itemType = itemType;
                // 地区 与 手机归属地
                typeof provCode === 'string' && provCode.length > 0 && (_currentLauncherData.provCode = provCode.split(','));
                typeof regionCode === 'string' && regionCode.length > 0 && (_currentLauncherData.regionCode = regionCode.split(','));
                //  资源样式整合 {
                const itemTypeName = ITEM_TYPE_CONFIGNAME[itemType]; // pm or om
                const resourceList = {};
                const rList = [...RESOURCE_MAP?.[authTypeClass]?.[itemTypeName] ?? [], ...RESOURCE_MAP?.[authTypeClass]?.origin];
                const resourceStyleConfigs = Object.assign({}, RESOURCE_STYLE_CONFIG?.[authTypeClass]?.[itemTypeName] ?? {}, RESOURCE_STYLE_CONFIG?.[authTypeClass]?.origin ?? {});
                for (const rListElement of rList) {
                    const { resourceName, styleId } = rListElement;
                    const _resourceMsg = resourceMsg.find(r => r.resourceName === resourceName);
                    const _style = resourceStyleConfigs?.[styleId];
                    Object.assign(rListElement, _resourceMsg, _style);
                }
                resourceList[authTypeClass] = rList;
                //  资源样式整合 }
                const resourceInfoList = resourceList.admin || resourceList.applicant;
                // 资源转map
                let resourcesTotalTime = 0;
                const resourcesMap = {};
                for (const resource of (mkDefArray(_currentLauncherData?.resources))) {
                    const { resourceName, id, timeStatus, resourceScenes, preEndTime, preBeginTime } = resource;
                    resource.resourceStyle = resourceInfoList.find(r => r.resourceName === resourceName);
                    resourcesMap[id] = Object.assign(resource, { resourceId: id });
                    // resourceScenes: 0投放，1触发  推送不计入统计
                    // timeStatus: 1已保存，2已提交，3已驳回，不计入统计    4提交已确认(排期通过,物料待提交),5已生效待上线，6已生效已上线，7已生效已下线，8已失效…
                    if ([0, 1].includes(resourceScenes) && [4, 5, 6, 7, 8].includes(timeStatus)) {
                        resourcesTotalTime += (preEndTime - preBeginTime);
                    }
                }
                _currentLauncherData.resourcesTotalTime = resourcesTotalTime;
                _currentLauncherData.resourceInfoList = resourceInfoList;
                _currentLauncherData.resourcesMap = resourcesMap;
                _currentLauncherData.resourcesMapExt = {};
                /*
                *
                * *END = } 变换 currentLauncherData 以适应表单类型
                *
                * */
                dispatch({
                    currentLauncherData: _currentLauncherData, operateType: _operateType
                });
                return _currentLauncherData;
            } catch (e) {
                message.error(e.message);
            }
        }, // 修改当前投放对象,
        updateCurrentLaucherData (data = {}, extData = {}) {
            const { currentLauncherData } = state;
            const _currentLauncherData = Object.assign({}, currentLauncherData, data);
            dispatch({
                currentLauncherData: _currentLauncherData, ...extData
            });
            return _currentLauncherData;
        }, // 数据还原
        resetCurrentLauncherData (data = {}, extData = {}) {
            dispatch({
                currentLauncherData: null,
                operateType: -1,
                editLauncherOperateStep: 0,
                viewLauncherInModalByItemId: null,
                ...extData
            });
            return true;
        }, // 新增、修改的资源对象的设置
        editResourceInfo (resource) {
            let _editResourceData = null;
            if (resource === 'add') {
                _editResourceData = { id: getUUID() };
            } else {
                _editResourceData = resource;
            }
            dispatch({
                editResourceData: _editResourceData
            });
        }, //
        async deleteResource (id) {
            const that = this;
            try {
                const { currentLauncherData } = state;
                const { itemId } = currentLauncherData;
                const newResourceMap = currentLauncherData.resourcesMap;
                const resourcesMapExt = currentLauncherData.resourcesMapExt;
                if (newResourceMap[id]) {
                    await deleteResource(id);
                    await that.setCurrentLauncherData(itemId);
                }
                if (resourcesMapExt[id]) {
                    delete resourcesMapExt[id];
                    dispatch({
                        currentLauncherData: Object.assign({}, currentLauncherData)
                    });
                }
            } catch (e) {
                message.error(e.message);
            }
        }, // 提交 /保存数据
        async itemSubmit (requestType, _currentLauncherData) {
            try {
                const { currentLauncherData, operateType } = state;
                const operate = (() => {
                    switch (operateType) {
                        case 13:
                            return 2;
                        default:
                            return 1;
                    }
                })();
                const {
                    department, itemId, itemName, itemNote, itemStatus, itemType, maxVersion, minVersion, provCode, regionCode, resourcesMap, resourcesMapExt, system, tagType, tagTxt = ''
                } = _currentLauncherData;
                let { tag = '' } = currentLauncherData;
                const resources = (Object.values(Object.assign({}, resourcesMap, resourcesMapExt))).map(resource => {
                    const { preBeginTime, preEndTime, resconfigId, resourceName, resourceNote, resourceId, patternId } = resource;
                    const requestResource = { preBeginTime, preEndTime, resconfigId, resourceName, resourceNote };
                    resourceId && (requestResource.resourceId = resourceId);
                    patternId && (requestResource.patternId = patternId);
                    return requestResource;
                });
                tag = +tagType === 2 ? tagTxt : ((+tagType === 3 || +tagType === 6) ? tag : '');
                if (resources.length === 0) {
                    throw  { message: '至少配置一个资源' };
                }
                const requestData = {
                    resources, department, itemId, itemName, itemNote, itemStatus, itemType, maxVersion, minVersion, operate, provCode: provCode.join(','), regionCode: regionCode.join(','), system, tag, tagType
                };
                const Api = (() => {
                    switch (requestType) {
                        case 'save':
                            return saveItemApi;
                        case 'comit':
                            return commitItemApi;
                    }
                })();
                const result = await Api(requestData);
                dispatch({
                    fileListPush: []
                });
                // await that.getLauncherMagList();
                return result;
            } catch (e) {
                throw {
                    type: 'requestError', e
                };
            }
        }, //获取上传名单列表初始值
        async getFileList () {
            try {
                const { currentLauncherData } = state;
                const _imgUrl = currentLauncherData?.filePath || '';
                if (_imgUrl) {
                    const _name = /[^\/\\]+$/.exec(_imgUrl)[0].split('?')[0];
                    dispatch({
                        fileListPush: [{
                            name: _name, percent: 100, size: 22, status: 'done', thumbUrl: _imgUrl, type: 'picture', uid: `rc-upload-${new Date().getTime()}`, url: _imgUrl
                        }]
                    });
                } else {
                    dispatch({
                        fileListPush: []
                    });
                }
            } catch {
                dispatch({
                    fileListPush: []
                });
            }
        }, /*
        物料
        * */
        // 获取物料信息
        async getReviewDetail (resourceId) {
            try {
                if (!resourceId) {
                    throw { message: '资源Id不存在' };
                }
                const _currentResourceSupply = await getReviewDetailApi({ resourceId });
                dispatch({
                    currentResourceSupply: _currentResourceSupply
                });
                return _currentResourceSupply;
            } catch (e) {
                throw e;
            }
        }, /*  审核物料 */
        async reviewResourceHandler (reviewResource, _resourceId) {
            const that = this;
            const resourceId = _resourceId || reviewResource.resourceId;
            Modal.confirm({
                title: '提交审核', content: '是否确认通过？', okText: '确认', cancelText: '取消', onOk: async () => {
                    try {
                        await reviewResourceApi({ ...reviewResource, reviewResult: 1 });
                        await that.getReviewDetail(resourceId);
                    } catch (e) {
                        message.error(e.message);
                    }
                }
            });
        }, /*
        *
        * 排期管理逻辑
        *
        * */
        async reviewTime (params) {
            const { resource, reject } = params;
            const { resourceId, realBeginTime, realEndTime } = resource;
            const requestData = { resourceId, realBeginTime, realEndTime, timeStatus: reject ? 3 : 4 };
            try {
                return await reviewTimeApi(requestData);
            } catch (e) {
                throw e;
            }
        }, /*
        *
        *  通用给管理
        *
        * */
        // 通用管理-权限管理-数据获取
        setCurrentUniversalAuthorityData (data = {}) {
            dispatch({
                currentUniversalAuthorityData: Object.assign({}, DEFAULT_CURRENT_LAUNCHER_DATA, data)
            });
        }, // 通用管理-权限管理-数据清空
        resetCurrentUniversalAuthorityData () {
            dispatch({
                currentUniversalAuthorityData: null
            });
        }
    };
    return async (type, ...data) => {
        try {
            return await handlers[type](...data);
        } catch (e) {
            throw e;
        }
    };
}
