/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/2/7.
 * Copyright 2022/2/7 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/2/7
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { Regex } from '@hjq/uts';
import { FORM_LAYOUT } from '../../common';

const { Item, useForm } = Form;
export function TestInput (props) {
    const { testModalVisible, submitTest } = props;
    const [formEditTestRef] = useForm();
    const [testInput] = useState([{ name: 'name1' }, { name: 'name2' }, { name: 'name3' }, { name: 'name4' }, { name: 'name5' }]);
    const [layout] = useState({
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    });
    const _handleTestOk = async () => {
        const tests = await formEditTestRef.validateFields();
        submitTest(tests);
    };
    const _handleTestCancel = () => {
        submitTest(false);
        formEditTestRef.resetFields();
    };
    return <Modal
        title="测试名单"
        visible={testModalVisible}
        onOk={_handleTestOk}
        onCancel={_handleTestCancel}
        width={600}
        maxHeight={400}
        maskClosable={false}
        className="test-modal">
        <Form {...FORM_LAYOUT} form={formEditTestRef} name="formEditTestRef">
            {testInput.map((pro, index) => {
                return (
                    <Item fieldKey={index} key={index} name={pro.name} label="手机号" rules={[{ required: true, message: '请输入正确手机号' }, { pattern: Regex.reg.cellphone, message: '请输入正确手机号' }]}>
                        <Input style={{ width: '90%' }} placeholder="请输入手机号" maxLength={11} />
                    </Item>
                );
            })}
        </Form>
    </Modal>;
}
