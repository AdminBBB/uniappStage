/**
 * File Created by duanmingxue at 2022-01-26.
 * Copyright 2019 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author duanmingxue
 * @date 2022-01-26
 * @version */
import {Ax, Auth, Ua,getSpParam} from '@hjq/uts';

const {request, setConfig} = Ax;
const AxRequest = request;

export function getFamilyViewData() {
    return new Promise((resolve, reject) => {
        initFamilyData().then((res) => {
            resolve(res);
        }).catch((e) => {
            resolve(null);
        });
    });
}

export async function initFamilyData() {
    try {
        const binData = await Promise.all([getFamilyViewInfo(), getFamilyDefaultInfo(),getConfig()]);
        if (binData) {
            return binData;
        } else {
            throw null;
        }
    } catch (e) {
        throw e;
    }
}

// 获取家庭业务列表
function getFamilyViewInfo() {
    return new Promise((resolve, reject) => {
        AxRequest({
            url: `/exchange/familyBusiness/wojia/list/${Auth.passId}`,
            method: 'post'
        }).then((familyViewData) => {
            resolve(familyViewData || []);
        }).catch((err) => {
            reject(err);
        });
    });
}

//  获取家庭业务分省配置
function getConfig() {
    return new Promise((resolve, reject) => {
        AxRequest({
            url: `/exchange/familyBusiness/province/config/${Auth.passId}`,
            method: 'get'
        }).then((Data) => {
            resolve(Data || []);
        }).catch((err) => {
            reject(err);
        });
    });
}

// 获取家庭业务列表
function getFamilyDefaultInfo() {
    return new Promise((resolve, reject) => {
        /*AxRequest({
            url: `/_datas/myHomeIndex/Pattern87.json`,
            method: 'get'
        }).then((familyDefaultData) => {
            resolve(familyDefaultData || []);
        }).catch((err) => {
            reject(err);
        });*/
        getSpParam({RD_KEY:'myHomeDataView', RD_MAP_K:'data'}).then((res) => {
            resolve(res || []);
        }).catch((err) => {
            reject(err);
        });
    });
}

// 获取安防tokenexport
export function getAnFangToken(params) {
    return new Promise((resolve, reject) => {
        AxRequest({
            url: `/exchange/familyBusiness/anfang/getToken/${Auth.passId}`,
            data: {
                phoneNumber: Auth.mobile,
                ...params
            },
            method: 'post'
        }).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });
}
