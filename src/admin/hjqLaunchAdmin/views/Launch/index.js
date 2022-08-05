/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/9.
 * Copyright 2021/11/9 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/9
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { DataTable } from './components/DataTable/';
import { SearchForm } from './components/SearchForm/';
import { CreateLauncherMng } from './components/CreateLauncherMng/';
import { DeleteModal } from './components/DeleteModal';
import { NavLink } from './components/NavLink';

export function Launch () {
    return <div className={'g-launth'}>
        <div className={'g-header'}>
            <SearchForm />
            <CreateLauncherMng />
            <NavLink />
        </div>
        <DataTable />
        <DeleteModal />
    </div>;
}
