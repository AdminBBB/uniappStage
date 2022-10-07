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
import { Table, Button, message, Input, Form, Modal } from 'antd';
import moment from 'moment';
import { searchAuthListApi, getDeleteAuthority } from '../../service/api';
import { TABLE_DEFAULT_PAGESIZE, DEFAULT_PAGE_NO } from '../../service/CONSTANT';
import { useErrorModal } from '../../../../Controllers/useErrorModal';
import { getFirstItem } from '../../../../service/utils';
import { DATE_FORMDATE_TIME, OP_TIME_STATUS_TXT, AUTH_LIST_DATA_TXT } from '../../../../common/CONSTANT';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { COMMON_CONTEXT } from '../../../../store';
import { ViewUniversalAuthorityModal } from '../../../../components/ViewUniversalAuthorityModal';

const DEFAULT_DATA_FILTER_DATA = {
    page: DEFAULT_PAGE_NO,
    size: TABLE_DEFAULT_PAGESIZE,
    searchType: 1,
    searchField: '',
    searchKey: '',
    ascOrder: null
};
const { Search } = Input;
const { Item, useForm } = Form;
const { confirm } = Modal;
export function AuthorityDataTable () {
    const { dispatch, state: { AuthSearchData, LcrDependencesData, authTypeList, authTypeMap } } = useContext(COMMON_CONTEXT);
    const navigate = useNavigate();
    const [dataFilterData, setDataFilterData] = useState(AuthSearchData);
    const [dataList, setDataList] = useState([]);
    const [dataTotal, setDataTotal] = useState(0);
    const [tableLoading, settableLoading] = useState(false);
    const [authListFilter, setAuthListFilter] = useState([]);
    const [depListFilter, setDepListFilter] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState(null);
    const [sortedInfo, setSortedInfo] = useState(null);
    const [extraInfo, setExtraInfo] = useState(1);
    const ModalError = useErrorModal();
    const [searchForm] = useForm();
    const operateAuthority = async (item, type) => {
        dispatch({
            // viewLauncherInModalByItemId: item,
            viewUniversalAuthorityItem: item,
            universalType: type
        });
    };
    const deleteAuthorityCon = (item) => {
        confirm({
            title: '确定要删除吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            // centered: true,
            onOk () {
                deleteAuthority(item);
            },
            onCancel () {
            }
        });
    };
    const deleteAuthority = async (item) => {
        try {
            const res = await getDeleteAuthority({ id: item.id });
            message.success({ content: '删除权限成功' });
            searchAuthList();
        } catch {
        }
    };
    //获取权限类型列表
    // const getAuthList = async () => {
    //     settableLoading(true);
    //     try {
    //         const data = await getAuthListApi();
    //         setAuthListFilter(handleFilter(data));
    //         dispatch({ authList: data });
    //         settableLoading(false);
    //     } catch (e) {
    //         settableLoading(false);
    //         ModalError(e.message);
    //     }
    // };
    //处理筛选数据
    const handleFilter = (list) => {
        let data = [];
        list.forEach((pro, index) => {
            let item = {
                text: pro.authName,
                value: pro.authType
            };
            data.push(item);
        });
        return data;
    };
    //权限列表搜索
    const searchAuthList = async (options) => {
        settableLoading(true);
        const requestData = Object.assign({}, dataFilterData, options);
        setDataFilterData(requestData);
        try {
            const { data, total } = await searchAuthListApi(requestData);
            setDataList(data);
            setDataTotal(total);
            settableLoading(false);
            if ((!data || data?.length == 0) && requestData.page !== 1) {
                let num = Math.ceil(total / 10) == 0 ? 1 : Math.ceil(total / 10);
                let data = Object.assign(requestData, { page: num });
                setDataFilterData(data);
                searchAuthList(data);
            }
        } catch (e) {
            settableLoading(false);
            ModalError(e.message);
        }
    };
    const onChange = async (pagination, filters, sorter, extra) => {
        // console.log(pagination);
        // console.log(extra);
        // console.log(filters);
        //接口只支持单一条件搜索，所以以下做的比较复杂，选择某一条件时，要把其他条件重置
        let isDepSame = (filters?.department && filters?.department[0]) === (filteredInfo?.department && filteredInfo?.department[0]);
        let isAuthSame = (filters?.authType && filters?.authType[0]) === (filteredInfo?.authType && filteredInfo?.authType[0]);
        // console.log((filters?.department && filters?.department[0]) === (filteredInfo?.department && filteredInfo?.department[0]))
        // console.log((filters?.authType && filters?.authType[0]) === (filteredInfo?.authType && filteredInfo?.authType[0]))
        //如果两个筛选条件都选择了，则只取最后选择的那个条件，另一个重置
        if (filters?.department && filters?.authType) {
            let newFilters = filters;
            newFilters = isDepSame ? Object.assign({}, newFilters, { department: null }) : newFilters;
            newFilters = isAuthSame ? Object.assign({}, newFilters, { authType: null }) : newFilters;
            filters = newFilters;
        }
        //如果点的排序，要把筛选重置
        filters = extra.action == 'sort' ? Object.assign({}, filters, { department: null, authType: null }) : filters;
        //如果点的筛选，要把排序重置
        sorter = extra.action == 'filter' ? null : sorter;
        //排序有点问题，待定
        let tOptions = {
            searchType: (extra.action == 'sort' && sorter.order) ? 3 : extra.action == 'filter' ? 2 : (extra.action == 'sort' && !sorter.order) ? 1 : extraInfo,
            ascOrder: extra.action == 'sort' ? (sorter.order === 'ascend' ? false : sorter.order === 'descend' ? true : null) : null,
            authType: filters.authType && filters.authType[0] || '',
            searchField: filters.authType ? 'authType' : filters.department ? 'department' : '',
            searchKey: filters.authType ? filters.authType[0] : filters.department ? filters.department[0] : extra.action == 'paginate' ? dataFilterData.searchKey : ''
        };
        setExtraInfo(tOptions.searchType);
        setSortedInfo(sorter);
        setFilteredInfo(filters);
        const { current: page, pageSize: size } = pagination;
        searchAuthList(Object.assign({ page, size }, tOptions));
        //因为只支持单一搜索，所以筛选时将输入框内容置空
        searchForm.resetFields();
    };
    //重置
    const handleReset = () => {
        searchForm.resetFields();
        setExtraInfo(1);
        setFilteredInfo(null);
        setSortedInfo(null);
        searchAuthList(DEFAULT_DATA_FILTER_DATA);
    };
    //搜索
    const searchAuthority = (keyWord) => {
        setFilteredInfo(null);
        setSortedInfo(null);
        searchAuthList({ searchKey: keyWord, searchType: 1, searchField: '' });
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
            title: '部门',
            dataIndex: 'department',
            width: '15%',
            filters: depListFilter,
            filterMultiple: false,
            filteredValue: filteredInfo && filteredInfo.department
        },
        {
            title: '权限类型',
            dataIndex: 'authType',
            width: '10%',
            filters: authListFilter,
            filterMultiple: false,
            filteredValue: filteredInfo && filteredInfo.authType,
            render (v) {
                return authTypeMap[v].authName;
            }
        },
        {
            title: '电话',
            dataIndex: 'userPhone',
            width: '15%'
        },
        {
            title: '创建人/创建时间',
            dataIndex: 'publishTime',
            width: '15%',
            render (v, item) {
                return <p>
                    {item.createBy}<br />{moment(item.createTime).format(DATE_FORMDATE_TIME)}
                </p>;
            }
        },
        {
            title: <div className={'theade-operate'}><span>操作</span></div>,
            width: '20%',
            render (v, item) {
                return <div className={'operate-btn'}>
                    <Button onClick={() => operateAuthority(item, 'edit')}>编辑权限</Button>
                    <Button onClick={() => deleteAuthorityCon(item)}>删除</Button>
                </div>;
            }
        }
    ];
    useEffect(() => {
        if (authTypeList) {
            let list = handleFilter(authTypeList);
            list.unshift({ text: '全部', value: null });
            setAuthListFilter(list);
        }
    }, [authTypeList]);
    useEffect(() => {
        if (LcrDependencesData.depListFilter) {
            let list = LcrDependencesData.depListFilter;
            list.unshift({ text: '全部', value: null });
            setDepListFilter(list);
        }
    }, [LcrDependencesData.depListFilter]);
    useEffect(() => {
        searchAuthList();
    }, []);
    return <div>
        <Form form={searchForm} className={'u-search'}>
            <Item className="Item" name={'keyWord'} style={{ display: 'inline-block', marginBottom: '0' }}>
                <Search onSearch={searchAuthority} allowClear placeholder="姓名/电话" maxLength="40" />
            </Item>
            <Button onClick={handleReset} type={'primary'}>重置</Button>
            <Button className={'btn'} type={'primary'} onClick={() => operateAuthority({ add: 'new' }, 'add')}><PlusOutlined />新增权限</Button>
        </Form>
        <Table dataSource={dataList} bordered size={'small'} columns={columns}
               onChange={onChange}
               loading={tableLoading}
               rowKey={columns => columns.id}
               pagination={{ current: dataFilterData.page, showQuickJumper: true, pageSizeOptions: ['10', '20', '30', '40'], position: ['bottomCenter'], showTotal: (t) => `共${t}条`, pageSize: dataFilterData.size, total: dataTotal }} />
        <ViewUniversalAuthorityModal searchAuthList={searchAuthList} />
    </div>;
}
