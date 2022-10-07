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
import { Button, Table, Form, message, Input,Modal } from 'antd';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { searchWhiteListApi, getSaveWhiteList, getDeleteWhiteList } from '../../service/api';
import { TABLE_DEFAULT_PAGESIZE, DEFAULT_PAGE_NO } from '../../service/CONSTANT';
import { useErrorModal } from '../../../../Controllers/useErrorModal';
import { COMMON_CONTEXT } from '../../../../store';
import { useNavigate } from 'react-router-dom';
import { ViewUniversalWhiteModal } from '../../../../components/ViewUniversalWhiteModal';

const DEFAULT_DATA_FILTER_DATA = {
    page: DEFAULT_PAGE_NO,
    size: TABLE_DEFAULT_PAGESIZE,
    searchType: 1,
    searchKey: '',
    ascOrder: '',
};
const { Search } = Input;
const { Item, useForm } = Form;
const { confirm } = Modal;
export function WhitelistDataTable () {
    const navigate = useNavigate();
    const { state: {WhiteSearchData}, dispatch } = useContext(COMMON_CONTEXT);
    const [dataFilterData, setDataFilterData] = useState(WhiteSearchData);
    const [dataList, setDataList] = useState([]);
    const [dataTotal, setDataTotal] = useState(0);
    const [tableLoading, settableLoading] = useState(false);
    const [sortedInfo, setSortedInfo] = useState(false);
    const ModalError = useErrorModal();
    const [searchWhiteForm] = useForm();
    const operateWhite = async (item,type) => {
        dispatch({
            // viewLauncherItemIdInTimgMng: item,
            viewUniversalWhiteItem: item,
            universalType: type
        });
    };
    const columns = [
        {
            title: '姓名',
            width: '10%',
            dataIndex: 'userName',
            sorter: true,
            sortOrder: sortedInfo && sortedInfo.order
            //sortDirections: ['descend'],
        },
        {
            title: '电话',
            dataIndex: 'userPhone',
            width: '15%'
        },
        {
            title: '操作',
            width: '15%',
            align: 'center',
            render (v) {
                return <div className={'operate-btn'}>
                    <Button style={{opacity: v.productWhiteStatus ? '1' : '0.5'}} onClick={() => editWhite(v,'productWhiteStatus')}>产品</Button>
                    <Button style={{opacity: v.operateWhiteStatus ? '1' : '0.5'}} onClick={() => editWhite(v,'operateWhiteStatus')}>运营</Button>
                    <Button onClick={() => deleteWhiteCon(v)}>删除</Button>
                </div>;
            }
        }
    ];
    const getWhiteList = async (options) => {
        settableLoading(true);
        const requestData = Object.assign({}, dataFilterData, options);
        setDataFilterData(requestData);
        try {
            const { data, total } = await searchWhiteListApi(requestData);
            setDataList(data);
            setDataTotal(total);
            settableLoading(false);
            if((!data || data?.length == 0) && requestData.page !== 1){
                let num = Math.ceil(total/10) == 0 ? 1 : Math.ceil(total/10);
                let data = Object.assign(requestData,{page: num})
                setDataFilterData(data);
                getWhiteList(data)
            }
        } catch (e) {
            settableLoading(false);
            message.error(e.message);
            setTimeout(() => {
                if(e.message === '无操作权限'){
                    navigate('/')
                }
            },1000)
            
        }
    };
    //重置
    const handleReset = () => {
        searchWhiteForm.resetFields();
        setSortedInfo(false)
        getWhiteList(DEFAULT_DATA_FILTER_DATA)
    }
    //搜索
    const searchWhite = (keyWord) => {
        getWhiteList({searchKey:keyWord})
    }
    const onChange = (pagination, filters, sorter, extra) => {
        const { current: page, pageSize: size } = pagination;
        let tOptions = {
            searchType: sorter.order == undefined ? 1: 3,
            ascOrder: sorter.order === 'ascend' ? false : true,
            //后端接口只做了单一条件搜索，因此筛选时搜索字段没用，清空
            searchKey: ''
        };
        searchWhiteForm.resetFields();
        setSortedInfo(sorter)
        getWhiteList(Object.assign({ page, size }, tOptions));
    };
    //编辑
    const editWhite = async(item,type) => {
        try{
            let {id,userName,userPhone,productWhiteStatus,operateWhiteStatus} = item;
            let params = {id,userName,userPhone,productWhiteStatus,operateWhiteStatus}
            params[type] = item[type] == 1 ? 0 : 1;
            await getSaveWhiteList(params);
            getWhiteList();
            message.success({
                content: '编辑白名单成功'
            })
        } catch (e) {
            ModalError(e.message);
        }
    }
    const deleteWhiteCon = (item) => {
        confirm({
            title:'确定要删除吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            // centered: true,
            onOk() {
                deleteWhite(item)
            },
            onCancel() {},
        });
    }
    //删除
    const deleteWhite = async(item) => {
        try{
            await getDeleteWhiteList({id:item.id});
            message.success({
                content: '删除白名单成功'
            })
            getWhiteList();
        } catch (e) {
            ModalError(e.message);
        }
    }
    useEffect(() => {
        getWhiteList();
    }, []);
    return <div>
        <Form form={searchWhiteForm} className={'u-search'}>
            <Item className="Item" name={'keyWord'} style={{ display: 'inline-block',marginBottom: '0' }}>
                <Search onSearch={searchWhite} allowClear placeholder="姓名/电话" maxLength="40"/>
            </Item>
            <Button  onClick={handleReset} type={'primary'}>重置</Button>
            <Button className={'btn'} type={'primary'} onClick={() => operateWhite({add:'new'},'add')}><PlusOutlined />新增白名单</Button>
        </Form>
        <Table dataSource={dataList} bordered size={'small'} columns={columns}
                  onChange={onChange}
                  loading={tableLoading}
                  rowKey={columns => columns.id}
                  pagination={{ current: dataFilterData.page,showQuickJumper: true, pageSizeOptions: ['10', '20', '30', '40'], position: ['bottomCenter'], showTotal: (t) => `共${t}条`, pageSize: dataFilterData.size, total: dataTotal }} />
        <ViewUniversalWhiteModal getWhiteList={getWhiteList}/>
    </div>
}
