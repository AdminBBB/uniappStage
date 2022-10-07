/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/10.
 * Copyright 2021/11/15 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author raoshanshan@cmhi.chinamobile.com
 * @date 2021/11/15
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ViewLogsInfo } from './ViewLogInfo';

export function ViewLogs (props) {
    const { itemId } = useParams();
    const navigate = useNavigate();
    return <div className={'g-operateLauncherViewLogs'}>
        <div className={'g-operateLauncherViewLogsTop'}>
            <h2>查看操作日志</h2>
            <Button type={'primary'} size={'large'} onClick={() => navigate('/')}>返回列表</Button>
        </div>
        <div className={'g-viewLogsWrap'}>
            <ViewLogsInfo itemId={itemId} />
        </div>
    </div>;
}
