/**
 * File Created by duanmingxue at 2022-01-28.
 * Copyright 2019 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author duanmingxue
 * @date 2022-01-28
 * @version */
import uniAppbridge from '@hjq/uniappbridge';
import { Ua } from '@hjq/uts';
import { getAnFangToken } from '../../../api/familyView';
import { gotoUrl } from '../../../api/utils';


const _cloudParams = {
    appName: 'hejiaqin',
    // deviceType: 'WEB',
    deviceType: Ua.inIos ? 'IOS' : (Ua.inAndroid ? 'ANDROID' : ''),
    version: '',
    deviceId: '',
    anfangToken: ''
};


function getDeviceId() {
    return Ua.inIos ? uniAppbridge.getInfo('monitorDeviceId') : uniAppbridge.getInfo('traceInfo');
}

export function getCloudParams() {
    return new Promise((resolve, reject) => {
        Promise.all([getDeviceId(), uniAppbridge.getInfo('appVersion')]).then((res) => {
            _cloudParams['version'] = res[1] || '';
            if (res[0]) {
                _cloudParams['deviceId'] = Ua.inIos ? res[0] : (res[0]?.device_id || '');
            }
            getAnFangToken(_cloudParams).then((res) => {
                _cloudParams['anfangToken'] = res && res.token || '';
                window.cloudParams = _cloudParams;
                resolve(_cloudParams);
            }).catch((e) => {
                window.cloudParams = _cloudParams;
                reject(e);
            });
        }).catch((e) => {
            window.cloudParams = _cloudParams;
            reject(e);
        });
    });
}

export function openUrl(url) {
    let _url = url;
    if (window.cloudParams && _url.includes('deviceType') && !window.cloudParams['deviceType']) {
        return '该设备不支持';
    } else if (window.cloudParams) {
        Object.keys(window.cloudParams).forEach((_cloud) => {
            const _urlquery = '${' + _cloud + '}';
            if (_url.includes(_urlquery)) {
                _url = _url.replace(_urlquery, window.cloudParams[_cloud])
            }
        });
    }

    _url = _url.replace('http://hy-dj-api.worthcloud.net:9001/', 'http://36.138.107.160:9001/');
    gotoUrl(_url);
}
