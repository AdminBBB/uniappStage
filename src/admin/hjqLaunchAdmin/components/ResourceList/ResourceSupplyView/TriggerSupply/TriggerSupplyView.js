/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/30.
 * Copyright 2022/1/30 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/30
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useContext } from 'react';
import { Image } from 'antd';
import { RenderReviewResult } from '../common/RenderReviewResult';
import { COMMON_CONTEXT } from '../../../../store';

export function TriggerSupplyView (props) {
    const { state: { currentResourceSupply } } = useContext(COMMON_CONTEXT);
    // defined var
    const { resourceItem } = props;
    const [triggerReviewMap, setTriggerReviewMap] = useState({});
    const [triggerResource, setTriggerResource] = useState({});
    useEffect(() => {
        if (currentResourceSupply) {
            const { resource = {} } = currentResourceSupply;
            const { triggerReviewMap: _triggerReviewMap = {} } = resource;
            setTriggerResource(resource);
            setTriggerReviewMap(_triggerReviewMap);
        }
    }, [currentResourceSupply]);
    return <ul className={'g-TriggerSupplyView'}>
        <li>
            <div className={'item'}>
                <div className={'label'}>链接</div>
                <div className={'value'}>{triggerResource?.actionUrl || '--'}</div>
            </div>
            <RenderReviewResult ReviewBo={triggerReviewMap?.actionUrl} type={'txt'} />
        </li>
        
        <li>
            <div className={'item'}>
                <div className={'label'}>图片</div>
                <div className={'value'}>
                    {triggerResource?.imgUrl ?
                        <figure><Image src={triggerResource?.imgUrl} /></figure>
                        : '--'} </div>
            </div>
            <RenderReviewResult ReviewBo={triggerReviewMap?.imgUrl} type={'img'} />
        </li>
        
        <li>
            <div className={'item'}>
                <div className={'label'}>备注</div>
                <div className={'value'}>{triggerResource?.triggerDesc || '--'}</div>
            </div>
            <div className={'reviewResult'} />
        </li>
    
    </ul>;
}
