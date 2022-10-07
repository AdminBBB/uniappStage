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
import { Table, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { deleteOperateTimeApi, addOperateTimeApi } from '../../../../service/api';
import { getFirstItem } from '../../../../service/utils';
import { DATE_FORMDATE_TIME, DATE_FORMDATE_DATE, OP_TIME_STATUS_TXT } from '../../../../common/CONSTANT';
import { DEFAULT_DATA_FILTER_DATA } from '../../../../common/CONSTANT';
import { COMMON_CONTEXT } from '../../../../store';
import { useTimeMangeController } from '../../../../Controllers/useTimeMangeController';
import { useErrorModal } from '../../../../Controllers/useErrorModal';
import { useCheckAuthRight } from '../../../../Controllers/useCheckAuthRight';

export function OperateDataTable () {
    const { state } = useContext(COMMON_CONTEXT);
    const { operateTimes } = state;
    const { dataList = [], dataTotal = 0 } = operateTimes || {};
    const { checkRight } = useCheckAuthRight();
    const navigate = useNavigate();
    const [dataFilterData, setDataFilterData] = useState(DEFAULT_DATA_FILTER_DATA);
    const [tableLoading, settableLoading] = useState(false);
    const ModalError = useErrorModal();
    const timeMangeController = useTimeMangeController();
    // 获取列表
    const getOperateTimes = async (options = {}) => {
        settableLoading(true);
        const requestData = Object.assign({}, dataFilterData, options);
        if (requestData.opTimeStatus === 0) {
            delete requestData.opTimeStatus;
        }
        setDataFilterData(requestData);
        try {
            await timeMangeController('getOperateTimes', requestData);
        } catch (e) {
            ModalError(e.message);
        } finally {
            settableLoading(false);
        }
    };
    const onChange = async (pagination, filters, sorter) => {
        const { current: page, pageSize: size } = pagination;
        let tOptions = {
            department: getFirstItem(filters.department, null),
            timeSort: Number(sorter.order === 'ascend'),
            opTimeStatus: Number(filters?.opTimeStatus?.valueOf() ?? 0)
        };
        await getOperateTimes(Object.assign({ page, size }, tOptions));
    };
    const getOperateTimeDetail = (operateTimeId, type) => {
        navigate(`/EditOperateTime/${operateTimeId}/${type}`);
    };
    const addOperateTime = async () => {
        try {
            const operateTime = await addOperateTimeApi();
            await getOperateTimes();
            Modal.confirm({
                title: '新增排期成功',
                content: '是否进行排期编辑？',
                onOk () {
                    getOperateTimeDetail(operateTime.id, 10);
                }
            });
        } catch (e) {
            ModalError(e.message);
        }
    };
    const deleteOperateTime = (optime) => {
        const { id, startTime, endTime } = optime;
        Modal.confirm({
            title: `确定删除排期？`,
            content: `${moment(startTime).format(DATE_FORMDATE_DATE)} - ${moment(endTime).format(DATE_FORMDATE_DATE)}`,
            okText: '确定删除',
            cancelText: '我好像点错了',
            async onOk () {
                try {
                    await deleteOperateTimeApi(id);
                    await getOperateTimes();
                    Modal.success({ title: '删除成功' });
                } catch (e) {
                    ModalError(e.message);
                }
            }
        });
    };
    const columns = [
        {
            title: '排期时间',
            width: '20%',
            sorter: true,
            render (v, item) {
                const { startTime, endTime } = item;
                return `${moment(startTime).format(DATE_FORMDATE_TIME)} - ${moment(endTime).format(DATE_FORMDATE_TIME)}`;
            }
        },
        {
            title: '创建人',
            dataIndex: 'createBy',
            width: '10%'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: '15%',
            render (v) {
                return moment(v).format(DATE_FORMDATE_TIME);
            }
        },
        {
            title: '最后修改时间',
            dataIndex: 'updateTime',
            width: '15%',
            render (v) {
                return moment(v).format(DATE_FORMDATE_TIME);
            }
        },
        {
            title: '发布时间',
            dataIndex: 'publishTime',
            width: '15%',
            render (v) {
                return v ? moment(v).format(DATE_FORMDATE_TIME) : '-';
            }
        },
        {
            title: '排期状态',
            dataIndex: 'opTimeStatus',
            filters: OP_TIME_STATUS_TXT.map((v, i) => {
                return { value: i, text: v };
            }),
            filterMultiple: false,
            width: '10%',
            render (v) {
                return OP_TIME_STATUS_TXT[v];
            }
        },
        {
            title: <div className={'theade-operate'}>
                操作
                {checkRight([], 1) && <Button type={'primary'} onClick={addOperateTime}><PlusOutlined />新建排期</Button>}
            </div>,
            dataIndex: 'id',
            aign: 'center',
            render (id, operateTime) {
                const { opTimeStatus } = operateTime;
                const couldView = checkRight([2, 3, 4, 5]);
                const couldEdit = (checkRight([], 1) && opTimeStatus === 1) || (checkRight() && opTimeStatus === 2);
                const couldDelete = opTimeStatus === 1 && checkRight();
                const couldViewDate = opTimeStatus === 3;
                const couldReview = checkRight();
                return <div className={'btnWrap'}>
                    <a className={couldEdit ? 'active' : 'noactive'} onClick={() => getOperateTimeDetail(id, 10)}>编辑</a>
                    <a className={couldView ? 'active' : 'noactive'} onClick={() => getOperateTimeDetail(id, 20)}>查看</a>
                    <a className={couldDelete ? 'active' : 'noactive'} onClick={() => deleteOperateTime(operateTime)}>删除</a>
                    <a className={couldViewDate ? 'active' : 'noactive'} onClick={() => getOperateTimeDetail(id, 30)}>数据</a>
                    <a className={couldReview ? 'active' : 'noactive'} onClick={() => getOperateTimeDetail(id, 11)}>审核</a>
                </div>;
            }
        }
    ];
    useEffect(() => {
        getOperateTimes().then().catch();
    }, []);
    return <Table dataSource={dataList} bordered size={'small'} columns={columns}
                  onChange={onChange}
                  loading={tableLoading}
                  rowKey={columns => columns.id}
                  pagination={{ showQuickJumper: true, pageSizeOptions: ['10', '20', '30', '40'], position: ['bottomCenter'], showTotal: (t) => `共${t}条`, pageSize: dataFilterData.size, total: dataTotal }} />;
}
