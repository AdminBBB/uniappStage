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
import './style.less';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { AuthorityDataTable } from './components/AuthorityDataTable';
import { WhitelistDataTable } from './components/WhitelistDataTable';
import { SupertubeDataTable } from './components/SupertubeDataTable';
import { Tabs, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCheckAuthRight } from '../../Controllers/useCheckAuthRight';
/*用户权限集合  0：超级管理 1：视觉审核 2：产品管理 3：运营管理 4：产品申请 5：运营申请*/
const authMap = [
    { right: [0] },
    { right: [0, 2, 3] },
    { right: [0] }
];
const { TabPane } = Tabs;
export function UniversalManage () {
    const navigate = useNavigate();
    const { checkRight } = useCheckAuthRight();
    return <div className={'g-universalMange'}>
        <Button className={'returnLauncher'} type={'primary'} onClick={() => navigate('/')}>返回投放管理</Button>
        <Tabs className={'tabContainer'} defaultActiveKey="2" type="card">
            {
                checkRight() ? (
                    <TabPane tab="权限管理" key="1">
                        <AuthorityDataTable />
                    </TabPane>
                ) : null
            }
            {
                checkRight([2,3]) ? (
                    <TabPane tab="白名单管理" key="2">
                        <WhitelistDataTable />
                    </TabPane>
                ) : null
            }
            {
                checkRight() ? (
                    <TabPane tab="超管审核范围" key="3">
                        <SupertubeDataTable />
                    </TabPane>
                ) : null
            }
        
        </Tabs>
    </div>;
}
