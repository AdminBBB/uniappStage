/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/26.
 * Copyright 2022/1/26 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/26
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { RenderReviewResult } from '../common/RenderReviewResult';

export function SupplyUnitTitleItem (props) {

    const { label, value, titleReviewBo, resourceItem } = props;
    return <li className={'m-SupplyUnitTitleItemView'}>
        <div className={'item'}>
            <div className={'label'}>{label}</div>
            <div className={'value'}>{value}</div>
        </div>
        <RenderReviewResult ReviewBo={titleReviewBo} resourceItem={resourceItem} type={'txt'} />
    </li>;
}
