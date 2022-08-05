/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/7/23.
 * Copyright 2021/7/23 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/7/23
 * @version */
import axios from 'axios';
import getHost from '../getHost';
import isPureObject from '../isPureObject';
/*
* 工具函数
* */
function trArray (v) {
    let Ar = [];
    if (typeof v === 'string' || typeof v === 'number') {
        Ar.push(v);
    } else if (Array.isArray(v)) {
        Ar = v;
    }
    return Ar;
}
/*
* 原始 默认配置项
*
* */
const AX_DEFAULT_CONFIGS = {
    AX_SETTINGS: {
        codelabel: 'code',
        dataLabel: 'data',
        messageLabel: 'message',
        successCode: ['1000000', 1000000],
        noCache: false
    },
    CREATE_CONFIGS: {
        baseURL: getHost(),
        headers: {
            'Content-Type': 'application/json'
        }
    },
    AX_INSTANCE: null
};
/*
* 主要业务
* */
/*
*
* public axios Create
*
* */
function AX_CONSTRUCTOR (force = false) {
    const that = this;
    if (that.AX_INSTANCE && !force) {
        return that.AX_INSTANCE;
    } else {
        that.AX_INSTANCE = new Promise(resolve => {
            if (that.AX_SETTINGS.noCache) {
                that.CREATE_CONFIGS.headers['Cache-Control'] = 'no-cache';
            }
            resolve(axios.create(that.CREATE_CONFIGS));
        });
        return that.AX_INSTANCE;
    }
}
/*
*  class
* */
class Ax {
    constructor (configs = {}) {
        this.AX_SETTINGS = {};
        this.CREATE_CONFIGS = {};
        this.AX_INSTANCE = null;
        if (configs) {
            this.setConfig(configs);
        }
    }
    // 类实例
    static AX_INSTANCE = null;
    // 静态工具方法
    static _setConfig (configs) {
        const that = this;
        const { CREATE_CONFIGS, AX_SETTINGS } = AX_DEFAULT_CONFIGS;
        let _config = {},
            _headers = {},
            _createConfigs = {};
        const configMergeMap = {
            header: _headers,
            headers: _headers,
            createConfigs: _createConfigs,
            create: _createConfigs
        };
        for (const config of Object.entries(configs)) {
            const [k, v] = config;
            const configMergeItem = configMergeMap[k];
            if (configMergeItem && isPureObject(v)) {
                Object.assign(configMergeItem, v);
            } else {
                _config[k] = v;
            }
        }
        /* headers 的多方合并 */
        _createConfigs.headers = Object.assign({},
            CREATE_CONFIGS.headers,
            that.CREATE_CONFIGS && that.CREATE_CONFIGS.headers || {},
            _createConfigs.headers || {},
            _headers);
        /* 其他配置项合并 */
        if (that && AX_DEFAULT_CONFIGS !== this) {
            const _AxConfigs = Object.assign({}, AX_SETTINGS, that.AX_SETTINGS, _config);
            const _CreateConfigs = Object.assign({}, CREATE_CONFIGS, that.CREATE_CONFIGS, _createConfigs);
            Object.assign(that.AX_SETTINGS, _AxConfigs);
            Object.assign(that.CREATE_CONFIGS, _CreateConfigs);
        } else {
            Object.assign(AX_SETTINGS, _config);
            Object.assign(CREATE_CONFIGS, _createConfigs);
        }
        AX_CONSTRUCTOR.call(that, true);
    }
    static async _request (configs) {
        const { AX_SETTINGS } = this;
        try {
            const ax = await AX_CONSTRUCTOR.call(this);
            const res = await ax(configs);
            const data = res.data;
            let resultData = null;
            const res_code = data[AX_SETTINGS.codelabel];
            const res_data = trArray(AX_SETTINGS.dataLabel);
            // 正常返回
            if (trArray(AX_SETTINGS.successCode).includes(res_code)) {
                if (res_data.length === 1) {
                    resultData = data[res_data[0]];
                } else if (res_data.length > 1) {
                    resultData = [];
                    res_data.forEach(d => {
                        resultData.push(data[d]);
                    });
                } else {
                    resultData = data;
                }
                return resultData;
            }
            // code 异常处理
            else if (AX_SETTINGS.codeHandler && typeof AX_SETTINGS.codeHandler[res_code] === 'function') {
                throw AX_SETTINGS.codeHandler[res_code](res.data);
            } else {
                throw res.data;
            }
        } catch (e) {
            const error_status = e?.response?.status;
            const error_message = e?.response?.statusText || e?.message || JSON.stringify(e);
            if (window.eGuardLog) {
                window.eGuardLog({
                    errorType: 'XHRError',
                    source: configs.url,
                    message: `${error_status}:${error_message}`
                });
            }
            if (AX_SETTINGS.statusHandler && typeof AX_SETTINGS.statusHandler[error_status] === 'function') {
                throw AX_SETTINGS.statusHandler[error_status](e);
            }
            throw e;
        }
    }
    // 实例方法
    setConfig (configs) {
        Ax._setConfig.call(this, configs);
    }
    async request (configs) {
        try {
            return await Ax._request.call(this, configs);
        } catch (e) {
            throw e;
        }
    }
    // 静态方法
    static async setConfig (configs) {
        Ax._setConfig.call(AX_DEFAULT_CONFIGS, configs);
    }
    static async request (configs) {
        try {
            return await Ax._request.call(AX_DEFAULT_CONFIGS, configs);
        } catch (e) {
            throw e;
        }
    }
}
export default Ax;
