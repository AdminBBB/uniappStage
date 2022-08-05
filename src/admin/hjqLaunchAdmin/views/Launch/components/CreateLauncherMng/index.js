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
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { COMMON_CONTEXT } from '../../../../store';
import { ITEM_TYPE_TXT } from '../../../../common/CONSTANT';
/*用户权限集合  0：超级管理 1：视觉审核 2：产品管理 3：运营管理 4：产品申请 5：运营申请*/
const LAUNCH_TYPE_MAP = [
    { right: [0, 2, 4], style: 'gr' },
    { right: [0, 3, 5], style: 'bl' }
];
function CreateBtn (props) {
    const navigate = useNavigate();
    const { state: { authType } } = useContext(COMMON_CONTEXT);
    const { launchType = 0 } = props;
    const addItem = () => {
        navigate(`/editLauncher/add/${launchType}`);
    };
    const { right, style } = LAUNCH_TYPE_MAP[launchType];
    return right.includes(authType) ? <Button className={style} type="primary" onClick={addItem}><PlusOutlined />创建{ITEM_TYPE_TXT[launchType]}投放管理</Button> : null;
}
export function CreateLauncherMng () {
    return <div className={'g-CreateResourceMge'}>
        <CreateBtn launchType={0} />
        <CreateBtn launchType={1} />
    </div>;
}
