/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/10.
 * Copyright 2021/11/10 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/10
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Input, Button, Switch, Form } from 'antd';
import { COMMON_CONTEXT } from '../../../../store';
import { useLcrMngOperaters } from '../../../../Controllers/useLcrMngOperaters';

const { Search } = Input;
const { Item, useForm } = Form;
export function SearchForm () {
    const { state } = useContext(COMMON_CONTEXT);
    const { LauncherFilterKeyWord, userInfo: { userId, userName } } = state;
    const [searchForm] = useForm();
    const LcrMngOperaters = useLcrMngOperaters();
    const searchTable = async (options) => {
        await LcrMngOperaters('getLauncherMagList', options);
    };
    const handleReset = async () => {
        searchForm.setFieldsValue({ keyWord: '' });
        await LcrMngOperaters('getLauncherMagList', Object.assign({}, { page: 1, size: 12, keyWord: '' }));
    };
    return <div className={'g-SearchForm'}>
        <Form form={searchForm} className={'g-SearchForm'} initialValues={{ keyWord: LauncherFilterKeyWord }}>
            <Item name={'keyWord'}>
                <Search allowClear onSearch={(keyWord) => searchTable({ keyWord, page: 1 })} maxLength={50} placeholder="条目ID/项目名称/创建人" />
            </Item>
            <Item name={'reset'} style={{ marginLeft: '16px' }}>
                <Button onClick={handleReset} type={'primary'}>重置</Button>
            </Item>
        </Form>
        <div className={'viewSelf'}>
            <span className={'lab'}>只看自己</span>
            <Switch checked={LauncherFilterKeyWord === userId || LauncherFilterKeyWord === userName}
                    onChange={async (v) => {
                        const keyWord = v ? userName : '';
                        await searchTable({ keyWord });
                        searchForm.setFieldsValue({ keyWord });
                    }} />
        </div>
    </div>;
}
