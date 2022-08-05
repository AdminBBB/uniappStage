/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/8/12.
 * Copyright 2021/8/12 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/8/12
 * @version */
import React from 'react';
import { Tooltip } from 'antd';
/*
*
*
* */
export function ItemBtn (props) {
    const { data, visible, handler, vkey, tooltip, compareKey, children } = props;
    return (visible || (vkey && data[vkey]))
        ? (<Tooltip placement="bottom" color={'#315480'} title={
            Array.isArray(tooltip) && compareKey ?
                (data[compareKey] ?
                    tooltip[0] :
                    tooltip[1]) :
                tooltip
        } arrowPointAtCenter={true} mouseEnterDelay={.1}>
            <a onClick={() => handler(data)}>
                {compareKey ? (data[compareKey] ? children[0] : children[1]) :
                    children
                }
            </a>
        </Tooltip>)
        : null;
}
