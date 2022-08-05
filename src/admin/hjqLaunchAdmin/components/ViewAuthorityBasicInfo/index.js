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
import React, { useContext, useEffect } from 'react';
import { Button, Modal } from 'antd';
import moment from 'moment';
import { DATE_FORMDATE_TIME } from '../../common/CONSTANT';
import { useUtils } from '../../Controllers/useUtils';
import { useLcrMngOperaters } from '../../Controllers/useLcrMngOperaters';
import { COMMON_CONTEXT } from '../../store/index';
import Form from 'antd/lib/form/Form';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
};
const { Item, useForm } = Form;

export function ViewAuthorityBasicInfo (props) {
    const { editResource } = props;
    const { state: { currentLauncherData, viewLauncherInModalByItemId, operateType } } = useContext(COMMON_CONTEXT);
    const { resourcesMap, resourcesMapExt } = currentLauncherData;
    const rUtils = useUtils();
    const LcrMngOperaters = useLcrMngOperaters();
    const [formEdit] = useForm();
    
    return <div>
        <Form>

        </Form>
    </div>
   
}
