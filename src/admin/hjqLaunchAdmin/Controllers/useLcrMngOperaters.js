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
import { useCheckAuthRight } from './useCheckAuthRight';

const trFile = (str, filePath) => {
    let _fileStr = typeof str === 'string' ? str.trim() : '';
    if (typeof _fileStr === 'string' && _fileStr !== '') {
        const files = _fileStr.split(',');
        if (filePath) {
            return files.map(f => {
                const name = f;
                return { name, url: filePath };
            });
        } else {
            return files.map(f => {
                const name = f.split('/').pop();
                return { name, url: f };
            });
        }
    } else {
        return [];
    }
};
export function useLcrMngOperaters () {
    const { state, dispatch } = useContext(COMMON_CONTEXT);
    const { checkRight } = useCheckAuthRight();
    const {
        operateType, authTypeClassMax, LcrDependencesData, userInfo
    } = state;
    const { resourceMsg } = LcrDependencesData;
    const handlers = {
        // ??????????????????
        async getLauncherMagList (options = {}) {
            const { LcrTablePageNo, LcrTablePageSize, LauncherFilterKeyWord } = state;
            const { keyWord = LauncherFilterKeyWord } = options;
            dispatch({
                rsmTableLoading: true
            });
            try {
                const requestData = Object.assign({ page: LcrTablePageNo, size: LcrTablePageSize }, { keyWord: keyWord }, options);
                const itemTypeSet = new Set();
                if (checkRight([1, 2, 4])) {
                    itemTypeSet.add(0);
                }
                if (checkRight([1, 3, 5])) {
                    itemTypeSet.add(1);
                }
                if (itemTypeSet.size === 1) {
                    requestData.itemType = Array.from(itemTypeSet)[0];
                }
                const { data, total } = await getItemListApi(requestData);
                dispatch({
                    LauncherData: data,
                    LauncherDataTotal: total,
                    LauncherFilterKeyWord: keyWord,
                    LcrTablePageSize: requestData.size,
                    LcrTablePageNo: requestData.page,
                    LcrTableLoading: false
                });
            } catch (e) {
                message.error(e.message);
            }
        }, // ??????????????????--???-??????
        switchOnline (record, operateType) {
            const operateTypeTxt = ['??????', '??????'][operateType];
            const that = this;
            let params = {
                itemId: record.itemId, operateType
            };
            Modal.confirm({
                title: `?????????${operateTypeTxt}???`, content: '', okText: '??????', cancelText: '??????', async onOk () {
                    try {
                        await onOffLine(params);
                        message.success(`${operateTypeTxt}??????`);
                        await that.getLauncherMagList();
                    } catch (err) {
                        message.error(err?.message ?? '??????????????????????????????');
                    }
                }
            });
        }, // ??????????????????--    //????????????????????????
        async grayStatusEdit (record) {
            const that = this;
            let params = {
                itemId: record.itemId, grayStatus: record.grayStatus === 1 ? 0 : 1
            };
            try {
                await updateGrayStatus(params);
                message.success('????????????');
                await that.getLauncherMagList();
            } catch (e) {
                message.error(e?.message ?? '??????????????????????????????');
            }
        }, // ??????&??????????????????
        /*
        * @type
        * */
        async setCurrentLauncherData (itemId, _operateType = operateType) {
            _operateType = Number(_operateType);
            try {
                const NEW_DEFAULT_CURRENT_DATA = Object.assign({}, DEFAULT_CURRENT_DATA);
                let _currentLauncherData = itemId === 'add' ? NEW_DEFAULT_CURRENT_DATA : (await getItemDetail(itemId));
                //* ???????????? ????????????????????????????????????????????????????????????
                _currentLauncherData.department = _currentLauncherData.department || (userInfo?.department ?? null);
                //* ?????????
                _currentLauncherData.msisdnType = isNaN(parseInt(_currentLauncherData.msisdnType, 10)) ? '3' : _currentLauncherData.msisdnType;
                // ????????????????????????
                _currentLauncherData.attachUrl = trFile(_currentLauncherData.attachUrl);
                /*
                * ?????? currentLauncherData ????????????????????? { = START
                * */
                _currentLauncherData.tagTxt = (_currentLauncherData?.tagType === 2) ? trFile(_currentLauncherData?.tag ?? '', _currentLauncherData.filePath) : '';
                if (_operateType === 11) { // 11 ??????
                    const __currentLauncherData = {};
                    const copyKeys = ['itemType', 'itemName', 'regionCode', 'provCode', 'system', 'minVersion', 'maxVersion', 'tagType', 'tagTxt', 'itemNote', 'tag'];
                    for (const key of copyKeys) {
                        __currentLauncherData[key] = _currentLauncherData[key];
                    }
                    __currentLauncherData.department = userInfo.department;
                    _currentLauncherData = __currentLauncherData;
                }
                const { itemType = _operateType, provCode, regionCode } = _currentLauncherData;
                _currentLauncherData.itemType = itemType;
                // ?????? ??? ???????????????
                typeof provCode === 'string' && provCode.length > 0 && (_currentLauncherData.provCode = provCode.split(','));
                typeof regionCode === 'string' && regionCode.length > 0 && (_currentLauncherData.regionCode = regionCode.split(','));
                //  ?????????????????? {
                const itemTypeName = ITEM_TYPE_CONFIGNAME[itemType]; // pm or om
                const resourceList = {};
                const rList = [...RESOURCE_MAP?.[authTypeClassMax]?.[itemTypeName] ?? [], ...RESOURCE_MAP?.[authTypeClassMax]?.origin];
                const resourceStyleConfigs = Object.assign({}, RESOURCE_STYLE_CONFIG?.[authTypeClassMax]?.[itemTypeName] ?? {}, RESOURCE_STYLE_CONFIG?.[authTypeClassMax]?.origin ?? {});
                for (const rListElement of rList) {
                    const { resourceName, styleId } = rListElement;
                    const _resourceMsg = resourceMsg.find(r => r.resourceName === resourceName);
                    const _style = resourceStyleConfigs?.[styleId];
                    Object.assign(rListElement, _resourceMsg, _style);
                }
                //  ?????????????????? }
                const resourceInfoList = rList;
                // ?????????map
                let resourcesTotalTime = 0;
                const resourcesMap = {};
                for (const resource of (mkDefArray(_currentLauncherData?.resources))) {
                    const { resourceName, id, timeStatus, resourceScenes, preEndTime, preBeginTime } = resource;
                    resource.resourceStyle = resourceInfoList.find(r => r.resourceName === resourceName);
                    resourcesMap[id] = Object.assign(resource, { resourceId: id });
                    // resourceScenes: 0?????????1??????  ?????????????????????
                    // timeStatus: 1????????????2????????????3???????????????????????????    4???????????????(????????????,???????????????),5?????????????????????6?????????????????????7?????????????????????8????????????
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
                * *END = } ?????? currentLauncherData ?????????????????????
                *
                * */
                dispatch({
                    currentLauncherData: _currentLauncherData,
                    operateType: _operateType
                });
                return _currentLauncherData;
            } catch (e) {
                message.error(e.message);
            }
        }, // ????????????????????????,
        updateCurrentLaucherData (data = {}, extData = {}) {
            const { currentLauncherData } = state;
            const _currentLauncherData = Object.assign({}, currentLauncherData, data);
            dispatch({
                currentLauncherData: _currentLauncherData, ...extData
            });
            return _currentLauncherData;
        }, // ????????????
        resetCurrentLauncherData (data = {}, extData = {}) {
            dispatch({
                currentLauncherData: null,
                operateType: -1,
                editLauncherOperateStep: 0,
                viewLauncherInModalByItemId: null,
                ...extData
            });
            return true;
        }, // ???????????????????????????????????????
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
        }, // ?????? /????????????
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
                const { department, itemId, itemName, itemNote, itemStatus, itemType, maxVersion, minVersion, provCode, regionCode, resourcesMap, resourcesMapExt, system, tagType, tagTxt = '', attachUrl, msisdnType = '3' } = _currentLauncherData;
                let tagTxtResolve = tagTxt?.[0]?.name ?? '';
                let { tag = '' } = currentLauncherData;
                const resources = (Object.values(Object.assign({}, resourcesMap, resourcesMapExt))).map(resource => {
                    const { preBeginTime, preEndTime, resconfigId, resourceName, resourceNote, resourceId, patternId } = resource;
                    const requestResource = { preBeginTime, preEndTime, resconfigId, resourceName, resourceNote };
                    resourceId && (requestResource.resourceId = resourceId);
                    patternId && (requestResource.patternId = patternId);
                    return requestResource;
                });
                tag = +tagType === 2 ? tagTxtResolve : ((+tagType === 3 || +tagType === 6) ? tag : '');
                if (resources.length === 0) {
                    throw  { message: '????????????????????????' };
                }
                const attachUrlReq = attachUrl.map(a => a.url).join(',');
                const requestData = {
                    resources, department, itemId, itemName, itemNote, itemStatus, itemType, maxVersion, minVersion, operate,
                    provCode: provCode.join(','),
                    regionCode: regionCode.join(','),
                    system, tag, tagType,
                    attachUrl: attachUrlReq,
                    msisdnType
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
        }, //?????????????????????????????????
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
        ??????
        * */
        // ??????????????????
        async getReviewDetail (resourceId) {
            try {
                if (!resourceId) {
                    throw { message: '??????Id?????????' };
                }
                const _currentResourceSupply = await getReviewDetailApi({ resourceId });
                dispatch({
                    currentResourceSupply: _currentResourceSupply
                });
                return _currentResourceSupply;
            } catch (e) {
                throw e;
            }
        }, /*  ???????????? */
        async reviewResourceHandler (reviewResource, _resourceId) {
            const that = this;
            const resourceId = _resourceId || reviewResource.resourceId;
            Modal.confirm({
                title: '????????????', content: '?????????????????????', okText: '??????', cancelText: '??????', onOk: async () => {
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
        * ??????????????????
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
        *  ???????????????
        *
        * */
        // ????????????-????????????-????????????
        setCurrentUniversalAuthorityData (data = {}) {
            dispatch({
                currentUniversalAuthorityData: Object.assign({}, DEFAULT_CURRENT_LAUNCHER_DATA, data)
            });
        }, // ????????????-????????????-????????????
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
