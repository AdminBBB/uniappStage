/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/27.
 * Copyright 2022/1/27 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/27
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Image } from 'antd';
import { RenderReviewResult } from '../../ResourceSupplyView/common/RenderReviewResult';

export function UnitThingView (props) {
    const { unitThing, reviewResourceHandler, resourceStyle } = props;
    const { unitTitle, unitSubtitle, extrInfo } = resourceStyle;
    const { unitReviewMap } = unitThing || {};
    return <ul className={'g-SupplyUnitThingsView'}>
        {
            unitTitle &&
            <li>
                <div className={'item'}>
                    <div className={'label'}>文案1</div>
                    <div className={'value'}>{unitThing.unitTitle}</div>
                </div>
                <RenderReviewResult ReviewBo={unitReviewMap?.unitTitle} type={'txt'} />
            </li>
        }
        {
            unitSubtitle &&
            <li>
                <div className={'item'}>
                    <div className={'label'}>文案2</div>
                    <div className={'value'}>{unitThing.unitSubtitle}</div>
                </div>
                <RenderReviewResult ReviewBo={unitReviewMap?.unitSubtitle} type={'txt'} />
            </li>
        }
        
        {
            unitThing.imgUrl &&
            <li>
                <div className={'item'}>
                    <div className={'label'}>图片</div>
                    <div className={'value'}>
                        <figure><Image src={unitThing.imgUrl} /></figure>
                    </div>
                </div>
                <RenderReviewResult ReviewBo={unitReviewMap?.imgUrl} type={'img'} />
            </li>
        }
        <li>
            <div className={'item'}>
                <div className={'label'}>链接</div>
                <div className={'value'}>{unitThing.actionUrl}</div>
            </div>
            <RenderReviewResult ReviewBo={unitReviewMap?.actionUrl} type={'txt'} />
        </li>
        {
            extrInfo &&
            <li>
                <div className={'item'}>
                    <div className={'label'}>备注</div>
                    <div className={'value'}>{unitThing.extrInfo}</div>
                </div>
                <div className={'res'} />
            </li>
        }
    </ul>;
}
