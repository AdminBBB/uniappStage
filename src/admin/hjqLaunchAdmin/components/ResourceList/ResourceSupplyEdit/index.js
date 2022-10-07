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
import React, { useEffect, useState } from 'react';
import { LauncherSupply } from './LauncherSupply/LauncherSupply.js';
import { TriggerSupply } from './TriggerSupply/TriggerSupply';
import { PushSupply } from './PushSupply/PushSupply';
import { message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useLcrMngOperaters } from '../../../Controllers/useLcrMngOperaters';

const SupplyEditMap = [
    LauncherSupply, // 投放
    TriggerSupply, // 触发
    PushSupply, // 触发
    PushSupply // 触发
];
export function ResourceSupplyEdit (props) {
    const { resourceScenes, resourceItem } = props;
    const SupplyEdit = SupplyEditMap[resourceScenes];
    const [isLoading, setIsLoading] = useState(true);
    const lcrMngOperaters = useLcrMngOperaters();
    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                await lcrMngOperaters('getReviewDetail', resourceItem.id);
                setIsLoading(false);
            } catch (e) {
                message.error(e.message);
            }
        })();
    }, []);
    return isLoading ?
        <div className={'supply_loading'}><LoadingOutlined /></div> :
        <SupplyEdit {...props} />;
}
