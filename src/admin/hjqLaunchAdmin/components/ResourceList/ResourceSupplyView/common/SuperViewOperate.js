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
import { COMMON_CONTEXT } from '../../../../store';
import { Button } from 'antd';
import { REVIEW_RESULT_MAP_BUILD } from '../../common';
import { useLcrMngOperaters } from '../../../../Controllers/useLcrMngOperaters';

const SuperViewOperateReviewKey = [
    'bannerReviewMap',
    'triggerReviewMap',
    'pushReviewMap',
    'pushReviewMap'
];
export function SuperViewOperate (props) {
    const { state: { operateType, currentResourceSupply, localauthType }, dispatch } = useContext(COMMON_CONTEXT);
    const { resourceScenes } = props;
    const lcrMngOperaters = useLcrMngOperaters();
    const superViewOperateReviewMap = currentResourceSupply?.resource?.[SuperViewOperateReviewKey[resourceScenes]]?.superView;
    const superReviewInfo = REVIEW_RESULT_MAP_BUILD(superViewOperateReviewMap?.reviewResult, ([31].includes(operateType) && localauthType === 0), superViewOperateReviewMap?.reviewComments, true);
    if (superReviewInfo === 'needReview') {
        return <div className={'g-submitUnitThingsBtnsWrap'}>
            <Button type={'primary'} className={'u-examine-approval'} onClick={async () => {
                await lcrMngOperaters('reviewResourceHandler', superViewOperateReviewMap);
            }}>超管审核通过</Button>
            <Button type={'primary'} danger className={'u-examine-reject'} onClick={() => {
                dispatch({ rejectModalVisible: superViewOperateReviewMap });
            }}>超管审核驳回</Button>
        </div>;
    } else if (superReviewInfo) {
        return <div className={'g-submitUnitThingsBtnsWrap'}> {superReviewInfo} </div>;
    } else {
        return null;
    }
}
