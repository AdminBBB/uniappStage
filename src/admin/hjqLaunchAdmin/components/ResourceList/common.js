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
import React from 'react';
import { Tag, Tooltip } from 'antd';

export const FORM_LAYOUT = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 }
};
export const FORM_LAYOUT_SHORTLAB = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 }
};
export const SUPPLY_VISIBLE_TYPE = {
    /*
    * 0 不予呈现
    * 1，查看
    * 2 审核操作
    * 3 form编辑
    * */
    0: 0, // 新增产品
    1: 0,  // 新增运营
    10: 0, //从投放管理列表修改修改
    11: 0,//复制
    12: 0,//从排期管理处修改
    13: 0,//追加
    14: 3,//物料
    15: 3,//更新
    20: 1,//查看
    21: 1,//运营排期管理查看
    22: 1,// 产品排期管理查看
    31: 2//审核
};
export const REVIEW_RESULT_MAP = {
    0: { txt: '未审核', style: '' },
    1: { txt: '已通过', style: 'green' },
    2: { txt: '已驳回', style: 'red' }
};
function ReviewTag (props) {
    const { rt, c, surper } = props;
    if (rt) {
        const { txt, style } = rt;
        const t = surper ? `超管${txt}` : txt;
        return c ? <Tooltip title={c}><Tag color={style}>{t}</Tag></Tooltip> : <Tag color={style}>{t}</Tag>;
    } else {
        return null;
    }
}
export function REVIEW_RESULT_MAP_BUILD (reviewResult, isReview = false, reviewComments = '', surper = false) {
    const rt = REVIEW_RESULT_MAP?.[reviewResult];
    return (isReview && reviewResult === 0) ? 'needReview' : // 未审核状态，且是在审核操作中 返回true
        <ReviewTag c={reviewComments} rt={rt} surper={surper} />;
}
