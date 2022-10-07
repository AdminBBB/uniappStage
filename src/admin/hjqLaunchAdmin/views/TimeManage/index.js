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
import React, { useContext, useEffect, useState } from 'react';
import { ProdDataTable } from './components/ProdDataTable';
import { OperateDataTable } from './components/OperateDataTable';
import { Tabs, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ViewLauncherItemModal } from '../../components/ViewLauncherItemModal';
import { COMMON_CONTEXT } from '../../store';
import { useCheckAuthRight } from '../../Controllers/useCheckAuthRight';

const { TabPane } = Tabs;
export function TimeManage (props) {
    const { type = 0 } = useParams();
    const defaultActiveKey = String(type);
    const { checkRight } = useCheckAuthRight();
    const navigate = useNavigate();
    const [tablescroll, setTableScroll] = useState(document.documentElement.offsetHeight - 240);
    useEffect(() => {
        window.addEventListener('resize', () => {
            setTableScroll(document.documentElement.offsetHeight - 240);
        }, false);
    }, []);
    return <div className={'g-timeMange'}>
        <Button className={'returnLauncher'} type={'primary'} onClick={() => navigate('/')}>投放管理</Button>
        <Tabs className={'tabContainer'} defaultActiveKey={defaultActiveKey} type="card">
            {checkRight([1], 0) &&
                <TabPane tab="产品排期" key="0">
                    <ProdDataTable tablescroll={tablescroll} />
                </TabPane>}
            {checkRight([1], 1) &&
                <TabPane tab="运营排期" key="1">
                    <OperateDataTable />
                </TabPane>}
        </Tabs>
        <ViewLauncherItemModal tablescroll={tablescroll} />
    </div>;
}
