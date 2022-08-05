/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/2/8.
 * Copyright 2022/2/8 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/2/8
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { SERVICE_CONTEXT } from '../api/reducer';

export function DebuggerRender (props) {
    const { state: { UNIAPP_INFO, USER_INFO } } = useContext(SERVICE_CONTEXT);
    return <div className={'DebuggerRender'}>
        {props.children}
        <ul>
            {Object.entries(UNIAPP_INFO).map((u, i) => {
                const [k, v] = u;
                return <li key={i}>{k}:::{v}</li>;
            })}
        </ul>
        <ul>
            {Object.entries(USER_INFO).map((u, i) => {
                const [k, v] = u;
                return <li key={i}>{k}:::{v}</li>;
            })}
        </ul>
    </div>;
}
