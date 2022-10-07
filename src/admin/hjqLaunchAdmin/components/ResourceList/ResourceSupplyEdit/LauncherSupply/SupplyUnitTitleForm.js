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
import React, { useEffect } from 'react';
import { Divider, Form } from 'antd';
import { SupplyUnitTitleItem } from './SupplyUnitTitleItem.js';
import { FORM_LAYOUT } from '../../common';

export function SupplyUnitTitleForm (props) {
    const { titleReviewMap, resourceItem, Rref } = props;
    const { titleLeftTitle, titleLeftActionUrl, titleMidTitle, titleMidActionUrl, titleRightTitle, titleRightActionUrl, description } = resourceItem?.resourceStyle ?? {};
    const hasTitleInfo = [titleLeftTitle, titleLeftActionUrl, titleMidTitle, titleMidActionUrl, titleRightTitle, titleRightActionUrl, description].some(t => t);
    const {
        titleLeftTitle: titleLeftTitleBo,
        titleLeftActionUrl: titleLeftActionUrlBo,
        titleMidTitle: titleMidTitleBo,
        titleMidActionUrl: titleMidActionUrlBo,
        titleRightTitle: titleRightTitleBo,
        titleRightActionUrl: titleRightActionUrlBo,
        description: descriptionBo
    } = titleReviewMap;
    const [resourceUnitForm] = Form.useForm();
    useEffect(() => {
        Rref.current = resourceUnitForm;
    }, []);
    return <div className={'g-resourceUnitForm'}>
        <Form  {...FORM_LAYOUT} form={resourceUnitForm} name="resourceUnitForm"
               style={{ margin: hasTitleInfo ? '20px' : '0' }}
               labelAlign="right">
            {
                titleLeftTitle &&
                <SupplyUnitTitleItem label={'标题文案-左'} resourceItem={resourceItem} keyName={'titleLeftTitle'} titleReviewBo={titleLeftTitleBo} />
            }
            {
                titleLeftActionUrl &&
                <>
                    <SupplyUnitTitleItem label={'标题链接-左'} resourceItem={resourceItem} keyName={'titleLeftActionUrl'} titleReviewBo={titleLeftActionUrlBo} />
                    <Divider />
                </>
            }
            {
                titleMidTitle &&
                <SupplyUnitTitleItem label={'标题文案-中'} resourceItem={resourceItem} keyName={'titleMidTitle'} titleReviewBo={titleMidTitleBo} />
            }
            {
                titleMidActionUrl &&
                <>
                    <SupplyUnitTitleItem label={'标题链接-中'} resourceItem={resourceItem} keyName={'titleMidActionUrl'} titleReviewBo={titleMidActionUrlBo} />
                    <Divider />
                </>
            }
            {
                titleRightTitle &&
                <SupplyUnitTitleItem label={'标题文案-右'} resourceItem={resourceItem} keyName={'titleRightTitle'} titleReviewBo={titleRightTitleBo} />
            }
            {
                titleRightActionUrl &&
                <SupplyUnitTitleItem label={'标题链接-右'} resourceItem={resourceItem} keyName={'titleRightActionUrl'} titleReviewBo={titleRightActionUrlBo} />
            }
            {
                description &&
                <SupplyUnitTitleItem label={'备注'} resourceItem={resourceItem} keyName={'description'} titleReviewBo={descriptionBo} />
            }
        </Form>
    </div>;
}
