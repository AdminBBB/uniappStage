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
import { REVIEW_RESULT_MAP_BUILD } from '../../common';
import { Button } from 'antd';
import { useLcrMngOperaters } from '../../../../Controllers/useLcrMngOperaters';

export function RenderReviewResult (props) {
    const { state: { operateType, currentResourceSupply, localauthType }, dispatch } = useContext(COMMON_CONTEXT);
    const { ReviewBo, type } = props;
    const lcrMngOperaters = useLcrMngOperaters();
    const isReview = [31].includes(operateType) && (localauthType === 0 || (localauthType === 1 && type === 'img') || ([2, 3].includes(localauthType) && type === 'txt'));
    const reviewInfo = REVIEW_RESULT_MAP_BUILD(ReviewBo?.reviewResult, isReview, ReviewBo?.reviewComments, false);
    return reviewInfo === 'needReview' ?
        <div className={'operate'}>
            <Button type={'primary'} className={'u-examine-approval'} size={'small'} onClick={async () => {
                await lcrMngOperaters('reviewResourceHandler', ReviewBo, currentResourceSupply.resourceId);
            }}>通过</Button>
            <Button type={'primary'} danger className={'u-examine-reject'} size={'small'} onClick={() => {
                dispatch({ rejectModalVisible: ReviewBo });
            }}>驳回</Button>
        </div> :
        <div className={'reviewResult'}> {reviewInfo} </div>;
}
