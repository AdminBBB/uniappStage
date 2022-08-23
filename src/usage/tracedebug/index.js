/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/8/23.
 * Copyright 2022/8/23 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/8/23
 * @version */
import Tr, { setConfig } from '@hjq/trace';
import uniappBridge from '@hjq/uniappbridge';

setConfig({
    project: 'traceDebuger',
    parameters: {
        a: 1,
        b: 2
    }
});
Tr.vt();
uniappBridge.getInfo('traceSessionId').then(k => {
    alert(k);
});

