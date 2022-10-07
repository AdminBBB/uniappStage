/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/2/3.
 * Copyright 2022/2/3 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/2/3
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Tag } from 'antd';
import { COMMON_CONTEXT } from '../../../../store';
import { useLcrMngOperaters } from '../../../../Controllers/useLcrMngOperaters';
import { UploadFile } from './UploadFile';
import { TestInput } from './TestInput';
import { editResource, testPush } from '../../../../service/api';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FORM_LAYOUT, REVIEW_RESULT_MAP_BUILD } from '../../common';

const { Item, useForm } = Form;
export function PushSupply (props) {
    const [pushSupplyForm] = useForm();
    const { state: { operateType, currentLauncherData } } = useContext(COMMON_CONTEXT);
    // defined var
    const { resourceItem, isEditable } = props;
    const { resourceScenes, resourceId, contentId: _contentId, resourceStyle = {} } = resourceItem || {};
    const lcrMngOperaters = useLcrMngOperaters();
    const [contentId, setContentId] = useState(_contentId);
    const [pushReviewMap, setPushReviewMap] = useState({});
    const [testModalVisible, setTestModalVisible] = useState(false);
    const submitTest = async (submitResult) => {
        try {
            if (submitResult) {
                const pushContent = pushSupplyForm.getFieldValue('pushContent');
                const title = pushSupplyForm.getFieldValue('title');
                const linkUrl = pushSupplyForm.getFieldValue('linkUrl');
                if (!pushContent) {
                    throw  { message: '请先填写物料文案' };
                }
                const params = { resourceId, resourceScenes, pushContent, target: Object.values(submitResult).join(',') };
                if (title) {
                    params.title = title;
                }
                if (linkUrl) {
                    params.linkUrl = linkUrl;
                }
                await testPush(params);
                await lcrMngOperaters('setCurrentLauncherData', currentLauncherData.itemId, operateType);
                message.success('成功');
                setTestModalVisible(false);
            } else {
                setTestModalVisible(false);
            }
        } catch (e) {
            Modal.error({
                title: e.message
            });
        }
    };
    const submit = async () => {
        try {
            const { title, pushContent, linkUrl, remark, target } = await pushSupplyForm.validateFields();
            Modal.confirm({
                title: '请务必确认物料已经经过公司法务综合审核！',
                icon: <ExclamationCircleOutlined />,
                okText: '是',
                cancelText: '否',
                async onOk () {
                    try {
                        const params = { resourceId, resourceScenes, title, pushContent, linkUrl, remark, target: target.name };
                        params.contentId = contentId || null;
                        await editResource(params);
                        message.success('物料提交成功');
                        await getReviewDetail();
                    } catch (e) {
                        Modal.error({ title: e.message });
                    }
                }
            });
        } catch (e) {
            if (!e.errorFields && e.message) {
                Modal.error({ title: e.message });
            }
        }
    };
    const getReviewDetail = async () => {
        try {
            const _currentUnitThings = await lcrMngOperaters('getReviewDetail', resourceItem.id);
            if (_currentUnitThings) {
                const { resource } = _currentUnitThings;
                const { pushReviewMap: _pushReviewMap = {}, taskId } = resource || {};
                setPushReviewMap(_pushReviewMap);
                if (taskId) {
                    setContentId(taskId);
                }
                if (resource) {
                    pushSupplyForm.setFieldsValue(resource);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        getReviewDetail().then(_supplyUnitThingsMap => {
        });
        // setCurrentUnit(supplyUnitThings[0]);
    }, []);
    return <div className={'g-PushSupply'}>
        <Form {...FORM_LAYOUT} form={pushSupplyForm} className={'pushSupplyEditForm'}>
            {
                resourceStyle.title &&
                <div className={'item'}>
                    <Item label="标题文案" name={'title'}>
                        <Input disabled={isEditable === 0 || (isEditable === 2 && pushReviewMap?.title?.reviewResult === 1)} placeholder="请输入标题文案" maxLength={200} />
                    </Item>
                    <div className={'reviewResult'}>
                        {REVIEW_RESULT_MAP_BUILD(pushReviewMap?.title?.reviewResult)}
                    </div>
                </div>
            }
            <div className={'item'}>
                <Item label="文案" name={'pushContent'} rules={[{ required: true, message: '请输入文案' }]}>
                    <Input disabled={isEditable === 0 || (isEditable === 2 && pushReviewMap?.pushContent?.reviewResult === 1)} placeholder="请输入文案" maxLength={200} />
                </Item>
                <div className={'reviewResult'}>
                    {REVIEW_RESULT_MAP_BUILD(pushReviewMap?.pushContent?.reviewResult)}
                </div>
            </div>
            {
                resourceStyle.linkUrl &&
                <div className={'item'}>
                    <Item label="链接" name={'linkUrl'} rules={[{ required: true, message: '请输入文案' }]}>
                        <Input disabled={isEditable === 0 || (isEditable === 2 && pushReviewMap?.linkUrl?.reviewResult === 1)} placeholder="请输入文案" maxLength={200} />
                    </Item>
                    <div className={'reviewResult'}>
                        {REVIEW_RESULT_MAP_BUILD(pushReviewMap?.linkUrl?.reviewResult)}
                    </div>
                </div>
            }
            <div className={'item'}>
                <Item name="target"
                      label="独立名单"
                      extra="支持大小500M以内的txt文件"
                      rules={[{ required: true, message: '请上传独立名单' }]}>
                    <UploadFile resourceScenes={resourceScenes} />
                </Item>
                <div className={'reviewResult'}>
                    {REVIEW_RESULT_MAP_BUILD(pushReviewMap?.target?.reviewResult)}
                </div>
            </div>
            
            <div className={'item'}>
                <Item label="备注" name={'remark'}>
                    <Input disabled={isEditable === 0 || (isEditable === 2 && pushReviewMap?.remark?.reviewResult === 1)} placeholder="请输入备注" maxLength={100} />
                </Item>
                <div className={'reviewResult'} />
            </div>
        </Form>
        <TestInput testModalVisible={testModalVisible} submitTest={submitTest} />
        <div className={'g-submitUnitThingsBtnsWrap'}>
            {
                operateType === 14 && resourceItem?.applyPushCount ?
                    <Button style={{ width: '164px' }} onClick={() => setTestModalVisible(true)} type="primary">
                        测试投放（剩余{resourceItem?.applyPushCount}次）
                    </Button> :
                    null
            }
            <Button type={'primary'} onClick={submit}>提交物料</Button></div>
    </div>;
}
