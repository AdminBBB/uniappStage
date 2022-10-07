/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/17.
 * Copyright 2021/11/17 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/17
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import moment from 'moment';
import { TABLE_DEFAULT_PAGESIZE, DEFAULT_PAGE_NO } from '../../../../common/CONSTANT';
import { useErrorModal } from '../../../../Controllers/useErrorModal';
import { COMMON_CONTEXT } from '../../../../store';
import { getproductTimesApi } from '../../../../service/api';
import { getFirstItem } from '../../../../service/utils';
import { DATE_FORMDATE_TIME } from '../../../../common/CONSTANT';
import { useNavigate } from 'react-router-dom';
import { useCheckAuthRight } from '../../../../Controllers/useCheckAuthRight';

const DEFAULT_DATA_FILTER_DATA = {
    page: DEFAULT_PAGE_NO,
    size: TABLE_DEFAULT_PAGESIZE,
    department: null,
    timeSort: 0
};
export function ProdDataTable (props) {
    const navigate = useNavigate();
    const { state: { LcrDependencesData } } = useContext(COMMON_CONTEXT);
    const { checkRight } = useCheckAuthRight();
    const [dataFilterData, setDataFilterData] = useState(DEFAULT_DATA_FILTER_DATA);
    const [dataList, setDataList] = useState([]);
    const [dataTotal, setDataTotal] = useState(0);
    const [tableLoading, settableLoading] = useState(false);
    const ModalError = useErrorModal();
    const operateItem = async (itemId) => {
        navigate(`/editLauncher/${itemId}/22`);
    };
    const columns = [
        {
            title: '条目ID',
            dataIndex: 'itemId',
            width: '15%'
        },
        {
            title: '项目名称',
            dataIndex: 'itemName',
            width: '15%'
        },
        {
            title: '项目部门',
            dataIndex: 'department',
            filters: LcrDependencesData.depListFilter,
            filterMultiple: false,
            align: 'center',
            width: '15%'
        },
        {
            title: '创建人',
            dataIndex: 'createBy',
            align: 'center',
            width: '10%'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: '15%',
            align: 'center',
            render (v) {
                return moment(v).format(DATE_FORMDATE_TIME);
            }
        },
        {
            title: '申请提交时间',
            dataIndex: 'updateTime',
            width: '15%',
            sorter: true,
            align: 'center',
            render (v) {
                return moment(v).format(DATE_FORMDATE_TIME);
            }
        },
        {
            title: '操作',
            dataIndex: 'itemId',
            width: '15%',
            align: 'center',
            render (itemId) {
                return checkRight([], 0) ? <a onClick={() => operateItem(itemId)}>排期审核</a> : '--';
            }
        }
    ];
    const getTimeMangeList = async (options) => {
        settableLoading(true);
        const requestData = Object.assign({}, dataFilterData, options);
        setDataFilterData(requestData);
        try {
            const { data, total } = await getproductTimesApi(requestData);
            setDataList(data);
            setDataTotal(total);
            settableLoading(false);
        } catch (e) {
            settableLoading(false);
            ModalError(e.message);
        }
    };
    const onChange = async (pagination, filters, sorter, extra) => {
        const { current: page = 1, pageSize: size } = pagination;
        let tOptions = {
            department: getFirstItem(filters.department, null),
            timeSort: Number(sorter.order === 'ascend')
        };
        await getTimeMangeList(Object.assign({ page, size }, tOptions));
    };
    useEffect(() => {
        (async () => {
            await getTimeMangeList();
        })();
    }, []);
    return <Table dataSource={dataList} bordered size={'small'} columns={columns}
                  onChange={onChange}
                  loading={tableLoading}
                  rowKey={columns => columns.itemId}
                  scroll={{ y: props.tablescroll }}
                  pagination={{ showQuickJumper: true, pageSizeOptions: ['10', '20', '30', '40'], position: ['bottomCenter'], showTotal: (t) => `共${t}条`, pageSize: dataFilterData.size, total: dataTotal }} />;
}
