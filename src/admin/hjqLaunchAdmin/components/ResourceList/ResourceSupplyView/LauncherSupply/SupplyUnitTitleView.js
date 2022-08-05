/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/25.
 * Copyright 2022/1/25 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/25
 * @version */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { SupplyUnitTitleItem } from './SupplyUnitTitleItem.js';

export function SupplyUnitTitleView (props) {
    const { resourceStyle, titleBo, resourceItem } = props;
    const { titleReviewMap } = titleBo || {};
    const { titleLeftTitle, titleLeftActionUrl, titleMidTitle, titleMidActionUrl, titleRightTitle, titleRightActionUrl,description } = resourceStyle;
    const {
        titleLeftTitle: titleLeftTitleBo,
        titleLeftActionUrl: titleLeftActionUrlBo,
        titleMidTitle: titleMidTitleBo,
        titleMidActionUrl: titleMidActionUrlBo,
        titleRightTitle: titleRightTitleBo,
        titleRightActionUrl: titleRightActionUrlBo,
        description: descriptionBo
    } = titleReviewMap || {};
    return (titleLeftTitle || titleLeftActionUrl || titleMidTitle || titleMidActionUrl || titleRightTitle || titleRightActionUrl || description) ?
        <ul className={'g-SupplyUnitTitleViewList'}>
            {
                titleLeftTitle &&
                <SupplyUnitTitleItem label={'标题文案-左'} value={titleBo?.titleLeftTitle} titleReviewBo={titleLeftTitleBo} resourceItem={resourceItem} />
            }
            {
                titleLeftActionUrl &&
                <SupplyUnitTitleItem label={'标题链接-左'} value={titleBo?.titleLeftActionUrl} titleReviewBo={titleLeftActionUrlBo} resourceItem={resourceItem} />
            }
            {
                titleMidTitle &&
                <SupplyUnitTitleItem label={'标题文案-中'} value={titleBo?.titleMidTitle} titleReviewBo={titleMidTitleBo} resourceItem={resourceItem} />
            }
            {
                titleMidActionUrl &&
                <SupplyUnitTitleItem label={'标题链接-中'} value={titleBo?.titleMidActionUrl} titleReviewBo={titleMidActionUrlBo} resourceItem={resourceItem} />
            }
            {
                titleRightTitle &&
                <SupplyUnitTitleItem label={'标题文案-右'} value={titleBo?.titleRightTitle} titleReviewBo={titleRightTitleBo} resourceItem={resourceItem} />
            }
            {
                titleRightActionUrl &&
                <SupplyUnitTitleItem label={'标题链接-右'} value={titleBo?.titleRightActionUrl} titleReviewBo={titleRightActionUrlBo} resourceItem={resourceItem} />
            }
            {
                description &&
                <SupplyUnitTitleItem label={'备注'} value={titleBo?.description} titleReviewBo={descriptionBo} resourceItem={resourceItem} />
            }
        </ul> : null;
}
