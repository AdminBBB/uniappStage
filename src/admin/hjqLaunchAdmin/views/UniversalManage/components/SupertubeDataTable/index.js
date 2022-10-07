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
import { searchAuditListApi, getSaveAuditResource, getDeleteAuditResource } from '../../service/api';
import { TABLE_DEFAULT_PAGESIZE, DEFAULT_PAGE_NO } from '../../service/CONSTANT';
import { useErrorModal } from '../../../../Controllers/useErrorModal';
import { COMMON_CONTEXT } from '../../../../store';
import { DATE_FORMDATE_TIME, SUPER_ITEM_TYPE_TXT } from '../../../../common/CONSTANT';
import { useNavigate } from 'react-router-dom';
import { ViewUniversalAuditModal } from '../../../../components/ViewUniversalAuditModal';

const DEFAULT_DATA_FILTER_DATA = {
    page: DEFAULT_PAGE_NO,
    size: TABLE_DEFAULT_PAGESIZE,
    searchType: 1,
    searchKey: '',
    searchField: '',
};
const { Search } = Input;
const { Item, useForm } = Form;
const { confirm } = Modal;
const auditListFilter = [{text:'产品/运营',value:'0'},{text:'产品',value:'1'},{text:'运营',value:'2'}]
export function SupertubeDataTable () {
    const navigate = useNavigate();
    const { state: {AuditSearchData}, dispatch } = useContext(COMMON_CONTEXT);
    const [dataFilterData, setDataFilterData] = useState(AuditSearchData);
    const [dataList, setDataList] = useState([]);
    const [dataTotal, setDataTotal] = useState(0);
    const [tableLoading, settableLoading] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState(null);
    const ModalError = useErrorModal();
    const [searchAuditForm] = useForm();
    const operateAudit = async (item,type) => {
        dispatch({
            // viewLauncherItemIdInTimgMng: item,
            viewUniversalAuditItem: item,
            universalType: type
        });
    };
    const columns = [
        {
            title: '资源名称',
            width: '15%',
            dataIndex: 'resourceName',
            // sorter: true,
            //sortDirections: ['descend'],
        },
        {
            title: '资源类型',
            dataIndex: 'resourceType',
            width: '10%',
            filters: auditListFilter,
            filterMultiple: false,
            filteredValue: filteredInfo && filteredInfo.resourceType,
            render (v) {
                return SUPER_ITEM_TYPE_TXT[v];
            }
        },
        {
            title: '创建人/创建时间',
            dataIndex: 'userPhone',
            width: '15%',
            render (v,item) {
                return <p>
                    {item.createBy}<br/>{moment(item.createTime).format(DATE_FORMDATE_TIME)}
                </p>
            }
        },
        {
            title: '操作',
            width: '15%',
            align: 'center',
            render (v) {
                return <div className={'operate-btn'}>
                    <Button onClick={() => deleteAuditCon(v)}>删除</Button>
                </div>;
            }
        }
    ];
    const getAuditList = async (options) => {
        settableLoading(true);
        const requestData = Object.assign({}, dataFilterData, options);
        setDataFilterData(requestData);
        try {
            const { data, total } = await searchAuditListApi(requestData);
            setDataList(data);
            setDataTotal(total);
            settableLoading(false);
            if((!data || data?.length == 0) && requestData.page !== 1){
                let num = Math.ceil(total/10) == 0 ? 1 : Math.ceil(total/10);
                let data = Object.assign(requestData,{page: num})
                setDataFilterData(data);
                getAuditList(data)
            }
        } catch (e) {
            settableLoading(false);
            ModalError(e.message);
        }
    };
    //重置
    const handleReset = () => {
        searchAuditForm.resetFields();
        setFilteredInfo(null);
        getAuditList(DEFAULT_DATA_FILTER_DATA)
    }
    //搜索
    const searchAudit = (keyWord) => {
        setFilteredInfo(null);
        getAuditList({searchKey:keyWord,searchType: 1,})
    }
    const onChange = (pagination, filters, sorter, extra) => {
        const { current: page, pageSize: size } = pagination;
        //排序有点问题，待定
        let tOptions = {
            //resourceType: filters.resourceType && filters.resourceType[0] || '',
            searchType: 2,
            searchField: filters.resourceType && filters.resourceType[0] ?'resourceType' : '',
            //接口只支持单一条件搜索，因此其他条件清空
            searchKey: filters.resourceType && filters.resourceType[0] || ''
        };
        searchAuditForm.resetFields();
        setFilteredInfo(filters);
        getAuditList(Object.assign({ page, size }, tOptions));
    };
    
    const deleteAuditCon = (item) => {
        confirm({
            title:'确定要删除吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            // centered: true,
            onOk() {
                deleteAudit(item)
            },
            onCancel() {},
        });
    }
    //删除
    const deleteAudit = async(item) => {
        try{
            await getDeleteAuditResource({id:item.id});
            message.success({
                content: '删除成功'
            })
            getAuditList();
        } catch (e) {
            ModalError(e.message);
        }
    }
    useEffect(() => {
        getAuditList();
    }, []);
    return <div>
        <Form form={searchAuditForm} className={'u-search'}>
            <Item className="Item" name={'keyWord'} style={{ display: 'inline-block',marginBottom: '0' }}>
                <Search onSearch={searchAudit} allowClear placeholder="资源名称" maxLength="40"/>
            </Item>
            <Button  onClick={handleReset} type={'primary'}>重置</Button>
            <Button className={'btn'} type={'primary'} onClick={() => operateAudit({add:'new'},'add')}><PlusOutlined />新增范围</Button>
        </Form>
        <Table dataSource={dataList} bordered size={'small'} columns={columns}
                  onChange={onChange}
                  loading={tableLoading}
                  rowKey={columns => columns.id}
                  pagination={{ current: dataFilterData.page,showQuickJumper: true, pageSizeOptions: ['10', '20', '30', '40'], position: ['bottomCenter'], showTotal: (t) => `共${t}条`, pageSize: dataFilterData.size, total: dataTotal }} />
        <ViewUniversalAuditModal getAuditList={getAuditList}/>
    </div>
}
