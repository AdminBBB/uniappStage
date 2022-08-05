/**
 * File Created by duanmingxue at 2021-05-18.
 * Copyright 2019 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author duanmingxue
 * @date 2021-05-18
 * @version */
import { Launch } from './Launch';
import { EditLauncher } from './EditLauncher';
import { ViewLogs } from './ViewLogs';
import { TimeManage } from './TimeManage';
import { UniversalManage } from './UniversalManage';
import { EditOperateTime } from './EditOperateTime';

export default [
    {
        path: '/',
        RouteComponent: Launch,
        exact: true
    },
    {
        path: '/launcher',
        RouteComponent: Launch
    },
    {
        path: '/editLauncher/:itemId/:operateType',
        RouteComponent: EditLauncher
    },
    {
        path: '/viewLogs/:itemId',
        RouteComponent: ViewLogs
    },
    // 投放管理
    {
        path: '/timeManage/:type',
        RouteComponent: TimeManage
    },
    {
        path: '/EditOperateTime/:operateTimeId/:operateTimePageType',
        RouteComponent: EditOperateTime
    },
    // 通用管理
    {
        path: '/universalManage',
        RouteComponent: UniversalManage
    }
];
