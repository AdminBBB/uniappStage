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
import { Modal, Button, Form, Select, Input, message, Checkbox } from 'antd';
import { COMMON_CONTEXT } from '../../store';
import { useLcrMngOperaters } from '../../Controllers/useLcrMngOperaters';
import { getSaveAuditResource } from '../../views/UniversalManage/service/api.js';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 22 }
};
const { Item, useForm } = Form;
export function ViewUniversalAuditModal (props) {
    const { state, dispatch } = useContext(COMMON_CONTEXT);
    const { viewUniversalAuditItem, LcrDependencesData  } = state;
    const [checkedData, setCheckedData] = useState(null);
    const LcrMngOperaters = useLcrMngOperaters();
    const [formEdit] = useForm();
    useEffect(() => {
        if (viewUniversalAuditItem) {
            formEdit.setFieldsValue(viewUniversalAuditItem);
            LcrMngOperaters('setCurrentUniversalAuthorityData', viewUniversalAuditItem);
        }
    }, [viewUniversalAuditItem]);
    const submitForm = async () => {
        try {
            const Fd = await formEdit.validateFields();
        } catch (e) {
            // console.log(e);
        }
    };
    const handleOk = async () => {
        try {
            const Fd = await formEdit.validateFields();
            let params = {
                resourceName: checkedData.value,
                resourceType: checkedData.restype
            };
            getSaveAuditApi(params);
        } catch (e) {
        }
    };
    // ??????
    const getSaveAuditApi = async (params) => {
        try {
            await getSaveAuditResource(params);
            //props.searchAuthList()
            dispatch({
                viewUniversalAuditItem: null
            });
            setCheckedData(null);
            props.getAuditList();
            formEdit.resetFields();
            message.success({
                content: '??????????????????????????????'
            });
        } catch (e) {
            message.error(e.message);
        }
    };
    const handleCancel = async () => {
        dispatch({
            viewUniversalAuditItem: null
        });
        setCheckedData(null);
        formEdit.resetFields();
    };
    const changeRes = (val, option) => {
        setCheckedData(option);
    };
    return <Modal title={'????????????????????????'} className={'g-ViewUniversalAuditModal'} width={430} visible={viewUniversalAuditItem} maskClosable={false}
                  onCancel={() => handleCancel()}
                  footer={[
                      <Button key="back" onClick={() => handleCancel()} style={{color:'red'}}>??????</Button>,
                      <Button key="submit" onClick={() => handleOk()} style={{background:'#1890ff',color:'#ffffff'}}>??????</Button>]}>
        <div className={'g-viewUniversalAudit'}>
            <Form {...layout} form={formEdit} onFinish={submitForm}>
                <Item name="resourceName"
                      label="??????"
                      rules={[{ required: true, message: '???????????????' }]}>
                    <Select placeholder="???????????????" allowClear onSelect={changeRes}>
                        {(LcrDependencesData?.resourceMsgSuper ?? []).map((item, index) => {
                            return <Select.Option key={index} value={item.resourceName} restype={item.resourceType}>
                                {item.resourceName}
                            </Select.Option>;
                        })}
                    </Select>
                </Item>
            </Form>
        </div>
    </Modal>;
}
