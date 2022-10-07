/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/2/3.
 * Copyright 2022/2/3 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/2/3
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useContext, useState } from 'react';
import { RenderReviewResult } from '../common/RenderReviewResult';
import { COMMON_CONTEXT } from '../../../../store';

export function PushSupplyView (props) {
    // defined var
    const { state: { currentResourceSupply } } = useContext(COMMON_CONTEXT);
    const { resourceItem } = props;
    const { resourceStyle = {} } = resourceItem || {};
    const [pushReviewMap, setPushReviewMap] = useState({});
    const [pushSource, setPushSource] = useState({});
    useEffect(() => {
        if (currentResourceSupply) {
            const { resource = {} } = currentResourceSupply;
            const { pushReviewMap: _pushReviewMap = {}, taskId } = resource || {};
            setPushReviewMap(_pushReviewMap);
            setPushSource(resource);
        }
    }, [currentResourceSupply]);
    return <div className={'g-PushSupplyView'}>
        {
            resourceStyle.title &&
            <li>
                <div className={'item'}>
                    <div className={'label'}>标题文案</div>
                    <div className={'value'}>{pushSource?.title || '--'}</div>
                </div>
                <RenderReviewResult ReviewBo={pushReviewMap?.title}  type={'txt'}/>
            </li>
        }
        <li>
            <div className={'item'}>
                <div className={'label'}>文案</div>
                <div className={'value'}>{pushSource?.pushContent || pushSource?.content || '--'}</div>
            </div>
            <RenderReviewResult ReviewBo={pushReviewMap?.pushContent || pushReviewMap?.content} type={'txt'} />
        </li>
        {
            resourceStyle.title &&
            <li>
                <div className={'item'}>
                    <div className={'label'}>链接</div>
                    <div className={'value'}>{pushSource?.linkUrl || '--'}</div>
                </div>
                <RenderReviewResult ReviewBo={pushReviewMap?.linkUrl}  type={'txt'} />
            </li>
        }
        <li>
            <div className={'item'}>
                <div className={'label'}>独立名单</div>
                <div className={'value'}>
                    <a href={pushSource?.target ?? '#'}>{pushSource?.target || pushReviewMap?.flag || '--'}</a>
                </div>
            </div>
            <RenderReviewResult ReviewBo={pushReviewMap?.target}  type={'txt'} />
        </li>
        <li>
            <div className={'item'}>
                <div className={'label'}>备注</div>
                <div className={'value'}>
                    <a href="src/hjqAdmin/hjqLaunchAdmin/components/ResourceList/ResourceSupplyView/PushSupply/PushSupplyView">{pushSource?.remark || '--'}</a>
                </div>
            </div>
            <div className={'reviewResult'} />
        </li>
    </div>;
}
