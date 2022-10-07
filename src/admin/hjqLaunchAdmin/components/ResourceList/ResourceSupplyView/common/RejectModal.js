/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/2/16.
 * Copyright 2022/2/16 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/2/16
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Form, Input, message, Modal } from 'antd';
import { reviewResourceApi } from '../../../../service/api';
import { COMMON_CONTEXT } from '../../../../store';
import { useLcrMngOperaters } from '../../../../Controllers/useLcrMngOperaters';

const { Item, useForm } = Form;
const { TextArea } = Input;
export function RejectModal () {
    const { state: { rejectModalVisible, currentResourceSupply }, dispatch } = useContext(COMMON_CONTEXT);
    const [rejectReviewForm] = useForm();
    const lcrMngOperaters = useLcrMngOperaters();
    const rejectModalOkHandler = async () => {
        try {
            const { reviewComments } = await rejectReviewForm.validateFields();
            await reviewResourceApi({
                ...rejectModalVisible,
                reviewResult: 2,
                reviewComments
            });
            await lcrMngOperaters('getReviewDetail', currentResourceSupply.resourceId);
            rejectModalCancelHandler();
            message.success('已成功驳回');
        } catch (e) {
            if (!e.errorFields && e.message) {
                Modal.error({ title: e.message });
            }
        }
    };
    const rejectModalCancelHandler = () => {
        rejectReviewForm.resetFields();
        dispatch({
            rejectModalVisible: false
        });
    };
    return <Modal title="是否确认驳回" visible={rejectModalVisible} destroyOnClose
                  onOk={rejectModalOkHandler}
                  onCancel={rejectModalCancelHandler}
                  okText="确定"
                  cancelText="取消">
        <Form labelCol={{ span: 4 }}
              wrapperCol={{ span: 19 }}
              form={rejectReviewForm}
              name="currentReviewForm"
              labelAlign="left">
            <Item name="reviewComments" label="驳回原因" rules={[{ required: true, message: '请填写驳回原因' }]}>
                <TextArea style={{ width: '90%' }} placeholder="请输入驳回原因" maxLength={100} />
            </Item>
        </Form>
    </Modal>;
}
