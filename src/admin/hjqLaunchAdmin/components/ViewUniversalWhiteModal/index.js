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
import { Modal, Button, Form,  Input, message, Checkbox } from 'antd';
import { COMMON_CONTEXT } from '../../store';
import Validator from '../../common/Validator.js';
import { useLcrMngOperaters } from '../../Controllers/useLcrMngOperaters';
import { getSaveWhiteList } from '../../views/UniversalManage/service/api.js';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 22 }
};
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['产品白名单', '运营白名单'];
const tagLabel = [{ label: '自动', value: 1 }, { label: '接口', value: 3 }, { label: '名单', value: 2 }];
const { Item, useForm } = Form;
export function ViewUniversalWhiteModal (props) {
    const { state, dispatch } = useContext(COMMON_CONTEXT);
    const { viewUniversalWhiteItem } = state;
    const [checkedList, setCheckedList] = useState([]);
    const LcrMngOperaters = useLcrMngOperaters();
    const [formEdit] = useForm();
    useEffect(() => {
        if (viewUniversalWhiteItem) {
            formEdit.setFieldsValue(viewUniversalWhiteItem);
            LcrMngOperaters('setCurrentUniversalAuthorityData', viewUniversalWhiteItem);
        }
    }, [viewUniversalWhiteItem]);
    const onChange = list => {
        setCheckedList(list);
    };
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
            let params = Fd;
            params.productWhiteStatus = params.userType.indexOf('产品白名单') == -1 ? 0 : 1;
            params.operateWhiteStatus = params.userType.indexOf('运营白名单') == -1 ? 0 : 1;
            delete params.userType;
            getSaveWhiteApi(params);
        } catch (e) {
        }
    };
    // 添加白名单
    const getSaveWhiteApi = async (params) => {
        try {
            await getSaveWhiteList(params);
            //props.searchAuthList()
            dispatch({
                viewUniversalWhiteItem: null
            });
            props.getWhiteList();
            formEdit.resetFields();
            message.success({
                content: '新增白名单成功'
            });
        } catch (e) {
            console.log(e);
            console.log(e.message);
            message.error(e.message);
        }
    };
    const handleCancel = async () => {
        dispatch({
            viewUniversalWhiteItem: null
        });
        formEdit.resetFields();
    };
    return <Modal title={'白名单新增'} className={'g-ViewUniversalWhiteModal'} width={430} visible={viewUniversalWhiteItem} maskClosable={false}
                  onCancel={() => handleCancel()}
                  footer={[
                      <Button key="back" onClick={() => handleCancel()} style={{color:'red'}}>取消</Button>,
                      <Button key="submit" onClick={() => handleOk()} style={{background:'#1890ff',color:'#ffffff'}}>确定</Button>]}>
        <div className={'g-viewUniversalWhite'}>
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
                <Item label="类型"
                      name="userType"
                      rules={[{ required: true, message: '请选择白名单类型' }]}
                >
                    <CheckboxGroup options={plainOptions} key={plainOptions} value={checkedList} onChange={onChange} />
                </Item>
            
            </Form>
        </div>
    </Modal>;
}
