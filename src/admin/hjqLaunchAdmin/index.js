/**
 * File Created by duanmingxue at 2021-05-18.
 * Copyright 2019 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author duanmingxue
 * @date 2021-05-18
 * @version */
import React from 'react';
import ReactDom from 'react-dom/client';
import 'moment/locale/zh-cn';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { getDependsData } from './service/api';
import { defaultState } from './store';
import { App } from './views/App';

(async () => {
    try {
        const params = await getDependsData();
        Object.assign(defaultState, params);
        ReactDom.createRoot(document.querySelector('#app')).render(<ConfigProvider locale={zhCN}><App /></ConfigProvider>);
    } catch (e) {
        alert(e.message);
    }
})();





