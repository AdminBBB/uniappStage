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
import React from 'react';
import { Modal, message } from 'antd';

export function useErrorModal () {
    return (title='', content = '', type = 0) => {
        if (type === 0) {
            Modal.error({ content, title });
        } else {
            message.error(content);
        }
    };
}
