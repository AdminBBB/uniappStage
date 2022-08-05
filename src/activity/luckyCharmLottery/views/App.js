/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/8/3.
 * Copyright 2022/8/3 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/8/3
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SlogenHeader } from './components/SlogenHeader';

export function App (props) {
    return <div className={'g-wrap'}>
        <SlogenHeader imgsGroup={props.imgsGroup} />
    </div>;
}
