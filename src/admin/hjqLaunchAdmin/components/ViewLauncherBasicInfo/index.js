/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/15.
 * Copyright 2021/11/15 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/15
 * @version */
// eslint-disable-next-line no-unused-vars
import './style.less';
import React, { useContext } from 'react';
import { COMMON_CONTEXT } from '../../store';
import { useViewLaucherItem } from './useViewLaucherItem';

export function ViewLauncherBasicInfo (props) {
    const { state: { currentLauncherData } } = useContext(COMMON_CONTEXT);
    const { basic } = useViewLaucherItem();
    const getValues = (label) => {
        return Array.isArray(label) ? label.map((k) => currentLauncherData[k]) : [currentLauncherData[label]];
    };
    return <div className={`g-ViewLauncherBasicInfo ${props?.extClassName ?? 'nor'}`}>
        <ul>
            {
                currentLauncherData &&
                basic.map((data, index) => {
                    const { name, label, render } = data;
                    const keyValues = getValues(label);
                    const value = render ? render(...keyValues) : keyValues;
                    return <li key={index}>
                        <div className={'label'}>{name}</div>
                        <div className={'content'}>{value}</div>
                    </li>;
                })
            }
        </ul>
    </div>;
}
