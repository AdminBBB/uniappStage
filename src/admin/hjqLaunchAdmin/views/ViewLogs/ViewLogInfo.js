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
import React, { useState, useEffect } from 'react';
import { getOperationLogs } from '../../service/api.js';
import { Table } from 'antd';
import moment from 'moment';

export function ViewLogsInfo (props) {
    const { itemId } = props;
    const [tableData, setTableData] = useState([]);
    const getOperationLogsApi = () => {
        let params = {
            itemId
        };
        getOperationLogs(params).then(res => {
            setTableData(res);
        }).catch(err => {
        });
    };
    const columnsLogs = [
        {
            title: '操作',
            dataIndex: 'operation'
        },
        {
            title: '操作人',
            className: 'operatePhone',
            dataIndex: 'operatePhone'
        },
        {
            title: '时间',
            dataIndex: 'createTime',
            render: (text, record, index) => (
                <span>{moment(record.createTime).format('YYYY/MM/DD HH:mm')}</span>
            )
        }
    ];
    useEffect(() => {
        getOperationLogsApi();
    }, []);
    return <div className={'g-ViewLogsInfo'}>
        <Table
            columns={columnsLogs}
            dataSource={tableData}
            bordered
            size={'small'}
            scroll={{ y: document.documentElement.offsetHeight - 160 }}
            pagination={false}
        />
    </div>;
}
