/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/8/4.
 * Copyright 2022/8/4 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/8/4
 * @version */
import getHost from '../getHost';
import axios from 'axios';
import isPureObject from '../isPureObject';

const AXSETTING_DEFAULT = {
    codelabel: 'code',
    dataLabel: 'data',
    messageLabel: 'message',
    successCode: ['1000000', 1000000],
    codeHandler: {},
    statusHandler: {}
};
const CREATE_CONFIGS_DEFAULT = {
    baseURL: getHost(),
    headers: {
        'Content-Type': 'application/json'
    }
};
class Ax {
    /*  类内部函数  */
    static __trArray (v) {
        let Ar = [];
        if (typeof v === 'string' || typeof v === 'number') {
            Ar.push(v);
        } else if (Array.isArray(v)) {
            Ar = v;
        }
        return Ar;
    }
    static __assortConfig (config) {
        const axSetting = {};
        const axConfig = {};
        const default_axSetting_keys = Object.keys(AXSETTING_DEFAULT);
        for (const configItem of Object.entries(config)) {
            const [k, v] = configItem;
            if (default_axSetting_keys.includes(k)) {
                axSetting[k] = v;
            } else {
                axConfig[k] = v;
            }
        }
        return { axConfig, axSetting };
    }
    static __setConfig (config) {
        const { axConfig, axSetting } = Ax.__assortConfig(config);
        this.axSetting = Object.assign(this.axSetting, axSetting);
        for (const axConfigElement of Object.entries(axConfig)) {
            const [k, v] = axConfigElement;
            if (isPureObject(v)) {
                for (const vElement of Object.entries(v)) {
                    const [_k, _v] = vElement;
                    this.axInstance.defaults[k][_k] = v;
                }
            } else {
                this.axInstance.defaults[k] = v;
            }
        }
    }
    static async __request (configs) {
        const { axSetting } = this;
        const { codeHandler, codelabel, dataLabel, statusHandler, successCode } = axSetting;
        try {
            const ax = this.axInstance;
            const { data = {} } = await ax(configs);
            let resolveData = null;
            const res_code = data[codelabel];
            const res_data = Ax.__trArray(dataLabel);
            const res_successCode = Ax.__trArray(successCode);
            // 正常返回
            if (res_successCode.includes(res_code)) {
                if (res_data.length === 1) {
                    resolveData = data[res_data[0]];
                } else if (res_data.length > 1) {
                    resolveData = [];
                    res_data.forEach(d => {
                        resolveData.push(data[d]);
                    });
                } else {
                    resolveData = data;
                }
                return resolveData;
            }
            // code 异常处理
            else if (typeof codeHandler?.[res_code] === 'function') {
                throw  codeHandler?.[res_code](data);
            } else {
                throw  data;
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
            if (typeof statusHandler?.[error_status] === 'function') {
                throw  statusHandler?.[error_status](e);
            }
            throw e;
        }
    }
    /* 实例方法 */
    constructor (config) {
        const { axConfig, axSetting } = Ax.__assortConfig(config);
        this.axSetting = Object.assign({}, AXSETTING_DEFAULT, axSetting);
        this.axInstance = axios.create(Object.assign({}, CREATE_CONFIGS_DEFAULT, axConfig));
    }
    setConfig (config) {
        Ax.__setConfig.call(this, config);
    }
    request (config) {
        return Ax.__request.call(this, config);
    }
    static init () {
        Ax.axSetting = Object.assign({}, AXSETTING_DEFAULT);
        Ax.axInstance = axios.create(Object.assign({}, CREATE_CONFIGS_DEFAULT));
    }
    static setConfig (config) {
        Ax.__setConfig.call(Ax, config);
    }
    static request (config) {
        return Ax.__request.call(Ax, config);
    }
}
Ax.init();
export default Ax;
