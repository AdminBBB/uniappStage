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
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { LauncherSupplyView } from './LauncherSupply/LauncherSupplyView.js';
import { TriggerSupplyView } from './TriggerSupply/TriggerSupplyView';
import { PushSupplyView } from './PushSupply/PushSupplyView';
import { message } from 'antd';
import { useLcrMngOperaters } from '../../../Controllers/useLcrMngOperaters';
import { SuperViewOperate } from './common/SuperViewOperate';
import { RejectModal } from './common/RejectModal';
import { LoadingOutlined } from '@ant-design/icons';

const resourceScenesRenderMap = [
    LauncherSupplyView, // 投放
    TriggerSupplyView, // 触发
    PushSupplyView, // 推送
    PushSupplyView // 推送
];
export function ResourceSupplyView (props) {
    const { resourceScenes, resourceItem } = props;
    const ScenesRender = resourceScenesRenderMap[resourceScenes];
    const lcrMngOperaters = useLcrMngOperaters();
    const [isLoading, setIsLoading] = useState(true);
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
        <>
            <ScenesRender resourceItem={resourceItem} />
            <SuperViewOperate resourceScenes={resourceScenes} />
            <RejectModal />
        </>;
}
