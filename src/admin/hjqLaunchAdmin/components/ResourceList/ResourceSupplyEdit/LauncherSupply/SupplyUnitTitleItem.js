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
import React from 'react';
import { Form, Input } from 'antd';
import { REVIEW_RESULT_MAP_BUILD } from '../../common';

const { Item } = Form;
export function SupplyUnitTitleItem (props) {
    const { label, keyName, titleReviewBo, resourceItem } = props;
    const disabled = titleReviewBo?.reviewResult === 1;
    return <div className={'m-SupplyUnitTitleItem'}>
        <div className={'item'}>
            <Item label={label} name={keyName}>
                <Input disabled={disabled} placeholder={`请输入${label}`} maxLength={20} />
            </Item>
        </div>
        <div className={'operate'}>
            {REVIEW_RESULT_MAP_BUILD(titleReviewBo?.reviewResult)}
        </div>
    </div>;
}
