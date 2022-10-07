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
import { useCheckAuthRight } from '../../../../Controllers/useCheckAuthRight';
import { COMMON_CONTEXT } from '../../../../store';
/*用户权限集合  0：超级管理 1：视觉审核 2：产品管理 3：运营管理 4：产品申请 5：运营申请*/
function CreateBtn (props) {
    const { state: { localAuthType } } = useContext(COMMON_CONTEXT);
    const navigate = useNavigate();
    const { checkRight } = useCheckAuthRight();
    const { launchType = 0 } = props;
    const LAUNCH_TYPE_BTN_MAP = [
        {
            right: [1, 2, 3],
            name: '排期管理',
            url: (localAuthType) => {
                let urlType = 0;
                if (localAuthType.includes(2)) {
                    urlType = 0;
                } else if (localAuthType.includes(3)) {
                    urlType = 1;
                }
                return `/timeManage/${urlType}`;
            }
        },
        {
            right: [2, 3],
            name: '通用管理',
            url: () => '/universalManage'
        }
    ];
    const goItem = () => {
        navigate(url(localAuthType));
    };
    const { right, name, url } = LAUNCH_TYPE_BTN_MAP[launchType];
    return checkRight(right) ?
        <Button type="primary" onClick={goItem}>{name}</Button> :
        null;
}
export function NavLink () {
    return <div className={'g-NavLink'}>
        <CreateBtn launchType={0} />
        <CreateBtn launchType={1} />
    </div>;
}
