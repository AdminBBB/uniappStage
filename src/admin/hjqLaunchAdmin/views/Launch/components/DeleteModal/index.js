/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/16.
 * Copyright 2021/11/16 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/16
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { COMMON_CONTEXT } from '../../../../store';
import { deleteItem } from '../../../../service/api';
import { FORM_LAYOUT } from '../../../../common/CONSTANT';
import { useErrorModal } from '../../../../Controllers/useErrorModal';
import { useLcrMngOperaters } from '../../../../Controllers/useLcrMngOperaters';

const { TextArea } = Input;
const { Item, useForm } = Form;
export function DeleteModal () {
    const { state, dispatch } = useContext(COMMON_CONTEXT);
    const [deleteForm] = useForm();
    const ModalError = useErrorModal();
    const LcrMngOperaters = useLcrMngOperaters();
    const { deleteModalItemId } = state;
    const [confirmLoading, setconfirmLoading] = useState(false);
    const _handleModelCancel = () => {
        dispatch({ deleteModalItemId: null });
    };
    const _handleModelOk = async () => {
        try {
            setconfirmLoading(true);
            let validateFieldsResult = null;
            try {
                validateFieldsResult = await deleteForm.validateFields();
            } catch (e) {
                console.log(e);
                setconfirmLoading(false);
                return false;
            }
            await deleteItem({
                itemId: deleteModalItemId,
                deleteNote: validateFieldsResult?.deleteNote
            });
            await LcrMngOperaters('getLauncherMagList');
            deleteForm.resetFields();
            _handleModelCancel();
            setconfirmLoading(false);
            Modal.success({
                title: '??????????????????'
            });
        } catch (e) {
            setconfirmLoading(false);
            ModalError(e.message);
        }
    };
    return <Modal title="??????????????????"
                  visible={deleteModalItemId}
                  onOk={_handleModelOk}
                  okText="??????"
                  cancelText="??????"
                  confirmLoading={confirmLoading}
                  onCancel={_handleModelCancel}>
        <Form  {...FORM_LAYOUT}
               form={deleteForm}
               name="deleteForm">
            <Item name="deleteNote"
                  label="????????????"
                  rules={[{ required: true, message: '?????????????????????' }]}>
                <TextArea style={{ width: '90%' }} placeholder="?????????????????????" maxLength={40} />
            </Item>
        </Form>
    </Modal>;
}
