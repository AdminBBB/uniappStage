/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/7/18.
 * Copyright 2022/7/18 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/7/18
 * @version */
import '../less/style.less'
// eslint-disable-next-line no-unused-vars
import img1 from '../imgs/myHomeIndex_main_bean.png';
import React from 'react';

export function Index () {
    return <div className={'g-wrap'}>
        <img src={img1} alt="" />
    </div>;
}
