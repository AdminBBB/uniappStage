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
import { Modal, Button, Form, Select, Input, message } from 'antd';
import { COMMON_CONTEXT } from '../../store';
import Validator from '../../common/Validator.js';
import { useLcrMngOperaters } from '../../Controllers/useLcrMngOperaters';
import { getSaveAuthority } from '../../views/UniversalManage/service/api.js';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 22 }
};
const { Item, useForm } = Form;
export function ViewUniversalAuthorityModal (props) {
    const { state, dispatch } = useContext(COMMON_CONTEXT);
    const { viewUniversalAuthorityItem, LcrDependencesData, authTypeList } = state;
    const LcrMngOperaters = useLcrMngOperaters();
    const [formEdit] = useForm();
    useEffect(() => {
        if (viewUniversalAuthorityItem) {
            formEdit.setFieldsValue(viewUniversalAuthorityItem);
            LcrMngOperaters('setCurrentUniversalAuthorityData', viewUniversalAuthorityItem);
        }
    }, [viewUniversalAuthorityItem]);
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
            getSaveAuthorityApi(Fd);
        } catch (e) {
        }
    };
    // 添加/编辑权限
    const getSaveAuthorityApi = async (params) => {
        try {
            if (viewUniversalAuthorityItem?.id) {
                params.id = viewUniversalAuthorityItem.id;
            }
            await getSaveAuthority(params);
            props.searchAuthList();
            dispatch({
                viewUniversalAuthorityItem: null
            });
            formEdit.resetFields();
            message.success({
                content: viewUniversalAuthorityItem?.id ? '编辑权限成功' : '新增权限成功'
            });
        } catch (e) {
            message.error(e.message);
        }
    };
    const handleCancel = async () => {
        dispatch({
            viewUniversalAuthorityItem: null
        });
        formEdit.resetFields();
    };
    return <Modal title={'权限'} className={'g-viewUniversalAuthorityModal'} width={430} visible={viewUniversalAuthorityItem} maskClosable={false}
                  onCancel={() => handleCancel()}
                  footer={[
                      <Button key="back" onClick={() => handleCancel()} style={{color:'red'}}>取消</Button>,
                      <Button key="submit" onClick={() => handleOk()} style={{background:'#1890ff',color:'#ffffff'}}>确定</Button>]}>
        <div className={'g-viewUniversalAuthority'}>
            <Form {...layout} form={formEdit} onFinish={submitForm}>
                <Item label="姓名"
                      name="userName"
                      rules={[{ required: true, message: '请输入姓名' }]}>
                    <Input placeholder="请输入姓名" maxLength={20} />
                </Item>
                <Item label="电话"
                      name="userPhone"
                      rules={[{ required: true, message: '请输入电话' }, { validator: Validator.telephone }]}>
                    <Input placeholder="请输入电话" maxLength={20} />
                </Item>
                <Item label="邮箱"
                      name="userEmail"
                      rules={[{ required: true, message: '请输入邮箱' }]}>
                    <Input placeholder="请输入邮箱" maxLength={50} />
                </Item>
                <Item name="department"
                      label="部门"
                      rules={[{ required: true, message: '请选择部门' }]}>
                    <Select placeholder="请选择部门" allowClear>
                        {(LcrDependencesData?.depList ?? []).map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>;
                        })}
                    </Select>
                </Item>
                <Item name="authType"
                      label="权限"
                      rules={[{ required: true, message: '请选择权限' }]}>
                    <Select placeholder="请选择权限" allowClear>
                        {(authTypeList ?? []).map((item, index) => {
                            return <Select.Option key={index} value={item.authType}>
                                {item.authName}
                            </Select.Option>;
                        })}
                    </Select>
                </Item>
            
            </Form>
        </div>
    </Modal>;
}
