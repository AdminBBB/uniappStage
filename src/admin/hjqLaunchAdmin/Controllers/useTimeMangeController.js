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
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { COMMON_CONTEXT } from '../store';
import { getOperateTimesApi } from '../service/api';
import { DEFAULT_DATA_FILTER_DATA } from '../common/CONSTANT';

export function useTimeMangeController () {
    const { dispatch } = useContext(COMMON_CONTEXT);
    const handlers = {
        async getOperateTimes (options = DEFAULT_DATA_FILTER_DATA) {
            try {
                const { data, total } = await getOperateTimesApi(options);
                dispatch({
                    operateTimes: { dataList: data, dataTotal: total }
                });
            } catch (e) {
                throw e;
            }
        }
    };
    return async (type, ...data) => {
        handlers[type](...data);
    };
}
