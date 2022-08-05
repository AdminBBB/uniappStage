/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/7/20.
 * Copyright 2022/7/20 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/7/20
 * @version */
import { Ax, Auth, getUUID, getTk } from '@hjq/uts';
import uniAppbridge from '@hjq/uniappbridge';
import CryptoJS from 'crypto-js';
/*
 我的设备  myDevices
我的家人  myFamilyAccount
我的套餐  myBusinessData
商城订单  hjqMallOrders
 */

export const DATA_ASSETS_APIMAP = {
    myDevices: { unitName: 'myDevices', api: getFamilyDataAssetsOverviewApi },
    myFamilyAccount: { unitName: 'myFamilyAccount', api: getFamilyDataAssetsOverviewApi },
    myBusinessData: { unitName: 'myBusinessData', api: getFamilyBusinessListApi },
    hjqMallOrders: { unitName: 'hjqMallOrders', api: getHjqmallOrdersApi }
};
const ax = new Ax();
export async function getFamilyBusinessListApi () {
    let myBusinessData;
    try {
        const familyBusinessList = await ax.request({
            url: `/exchange/familyBusiness/list/${Auth.passId}`,
            method: 'post'
        });
        myBusinessData = familyBusinessList?.length;
    } catch (e) {
        // throw e;
        myBusinessData = 0;
    }
    return { [DATA_ASSETS_APIMAP.myBusinessData.unitName]: myBusinessData };
}
export async function getFamilyDataAssetsOverviewApi () {
    let myFamilyAccount, myDevices;
    try {
        const { familyDevice = {}, familyGroup = {} } = await ax.request({
            url: `/exchange/familyDataAssets/overview/${Auth.passId}`,
            method: 'post',
            data: { source: 1 }
        });
        myFamilyAccount = familyGroup?.familySize ?? 0;
        myDevices = familyDevice?.total ?? 0;
        
    } catch (e) {
        myFamilyAccount = null;
        myDevices = null;
    }
    return {
        [DATA_ASSETS_APIMAP.myFamilyAccount.unitName]: myFamilyAccount,
        [DATA_ASSETS_APIMAP.myDevices.unitName]: myDevices
    };
}
export async function getToken (inWeb = false) {
    try {
        if (inWeb) {
            return await getTk({
                passId: Auth.passId || '',
                JSESSIONID: Auth.JSESSIONID || ''
            });
        } else {
            return await uniAppbridge.getInfo('token');
        }
    } catch (e) {
        throw e;
    }
}
export function getAuthorization (isGetToken = true, baseToken = false) {
    let basicToken = '';
    if (isGetToken) {
        const channelId = Auth.channelId || 'unknow';
        const client_secret = 'df56cvg23'; // 固定值
        const base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(`${channelId}:${client_secret}`));
        basicToken = 'Basic ' + base64;
    } else {
        if (baseToken) {
            basicToken = 'Bearer ' + baseToken;
        }
    }
    return basicToken;
}
export function getRequestHeader ({
    url = '',
    body = '',
    contentType = 'application/json',
    baseToken = null,
    isGetToken = true
} = {}) {
    const timeStamp = Math.round(new Date().getTime());
    const requestId = getUUID();
    const _SHA1 = body ? CryptoJS.SHA1(JSON.stringify(body)).toString().toUpperCase() : '';
    const authorization = getAuthorization(isGetToken, baseToken);
    const signature = CryptoJS.MD5(`${url};${requestId};${authorization};${timeStamp};${_SHA1}`).toString().toUpperCase();
    return {
        requestrecord: requestId,
        authorization,
        requesttimestamp: timeStamp,
        signature,
        'Content-Type': contentType
    };
}
function mergeHeader (getRequestHeaderParams) {
    return {
        contentType: 'application/json',
        platformid: '1003',
        ...getRequestHeader(getRequestHeaderParams)
    };
}
export async function getSpToken () {
    try {
        const _token = await getToken(true);
        const data = {
            unityToken: _token,
            clientId: Auth.channelId || 'unknow'
        };
        return await ax.request({
            url: '/hjqmall/user/customer/get_token',
            method: 'post',
            data,
            headers: mergeHeader({
                url: '/customer/get_token',
                body: data,
                isGetToken: true
            })
        });
    } catch (e) {
    }
}
export async function getHjqmallOrdersApi () {
    let hjqMallOrders;
    try {
        const { tokenInfo: { token } } = await getSpToken();
        if (token) {
            const url = ['/hjqmall/order/opt/countGroupByType', '/opt/countGroupByType'];
            const {
                all = 0,
                delivered = 0,
                received = 0,
                refund = 0,
                success = 0,
                wait = 0
            } = await ax.request({
                url: url[0],
                method: 'post',
                data: {},
                headers: mergeHeader({
                    url: url[1],
                    body: {},
                    baseToken: token,
                    isGetToken: false
                })
            });
            hjqMallOrders = delivered + received + refund + success + wait;
        } else {
            hjqMallOrders = null;
        }
    } catch (e) {
        hjqMallOrders = null;
    }
    return { [DATA_ASSETS_APIMAP.hjqMallOrders.unitName]: hjqMallOrders };
}
