/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/15.
 * Copyright 2021/11/15 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/15
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { COMMON_CONTEXT } from '../../store';
import { Tag } from 'antd';
import { ITEM_STATUS_TXT, SYSTEM_TYPE_TXT, TAG_TYEP_TEXT } from '../../common/CONSTANT';
import moment from 'moment';

export function useViewLaucherItem () {
    const { state: { LcrDependencesData } } = useContext(COMMON_CONTEXT);
    return {
        basic: [
            {
                key: ['itemId', 'itemStatus'], name: '产品投放ID', render (itemId, itemStatus) {
                    return <span><b style={{ marginRight: '8px' }}>{itemId} </b><Tag color="blue">{ITEM_STATUS_TXT[itemStatus]}</Tag></span>;
                }
            },
            { key: 'itemName', name: '项目名称' },
            {
                key: 'resourcesTotalTime', name: '投放时间', render (v) {
                    return (v / (24 * 60 * 60 * 1000)).toFixed(2) + ' 天';
                }
            },
            { key: 'department', name: '项目归属部门' },
            {
                key: 'regionCode', name: '投放区域', render (v = '') {
                    return (v && (Array.isArray(v) ? v : v.split(',')) || []).map((r, i) => {
                        return <Tag key={i}>{LcrDependencesData?.regionsMap?.[r]}</Tag>;
                    });
                }
            },
            {
                key: 'provCode', name: '手机归属地', render (v = '') {
                    return (v && (Array.isArray(v) ? v : v.split(',')) || []).map((r, i) => {
                        return <Tag key={i}>{LcrDependencesData?.regionsMap?.[r]}</Tag>;
                    });
                }
            },
            {
                key: 'system', name: '系统类型', render (v) {
                    return SYSTEM_TYPE_TXT?.[v];
                }
            },
            {
                key: ['minVersion', 'maxVersion'], name: '版本', render (v1 = '', v2 = '') {
                    return `${v1} - ${v2}`;
                }
            },
            {
                key: ['tagType', 'tag'], name: '用户获取', render (tagType, tag) {
                    switch (tagType) {
                        case 3:
                        case 6:
                            return `${TAG_TYEP_TEXT?.[tagType]} : ${tag}`;
                        default:
                            return TAG_TYEP_TEXT?.[tagType];
                    }
                }
            },
            { key: 'itemNote', name: '备注' }
        ],
        resource: [
            {
                key: 'resourceName', name: '资源名称'
            },
            {
                key: ['preBeginTime', 'preEndTime'], name: '上线时间', render (v1, v2) {
                    return `${moment(v1).format('YYYY/MM/DD HH:mm')} - ${moment(v2).format('YYYY/MM/DD HH:mm')}`;
                }
            },
            {
                key: 'resourceOrder', name: '顺序选择'
            },
            {
                key: 'resourceNote', name: '备注'
            }
        ]
    };
}
