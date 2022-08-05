/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/30.
 * Copyright 2022/1/30 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/30
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import { useLcrMngOperaters } from '../../../../Controllers/useLcrMngOperaters';
import { UploadImg } from '../LauncherSupply/UploadImg';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { editResource } from '../../../../service/api';
import { FORM_LAYOUT_SHORTLAB, REVIEW_RESULT_MAP_BUILD } from '../../common';

const { Item, useForm } = Form;
export function TriggerSupply (props) {
    // defined var
    const { resourceItem, isEditable } = props;
    const { resourceScenes } = resourceItem || {};
    const [currentUnitForm] = useForm();
    const lcrMngOperaters = useLcrMngOperaters();
    const [currentUnitThings, setCurrentUnitThings] = useState({});
    const [triggerReviewMap, setTriggerReviewMap] = useState({});
    const getReviewDetail = async () => {
        try {
            const _currentUnitThings = await lcrMngOperaters('getReviewDetail', resourceItem.id);
            if (_currentUnitThings) {
                const { resource = {} } = _currentUnitThings;
                const { triggerReviewMap: _triggerReviewMap = {} } = resource;
                setTriggerReviewMap(_triggerReviewMap);
                setCurrentUnitThings(_currentUnitThings);
                if (resource) {
                    currentUnitForm.setFieldsValue(resource);
                }
            }
        } catch (e) {
            console.log(e);
        }
    };
    const submit = async () => {
        try {
            const _triggerValue = await currentUnitForm.validateFields();
            const _data = Object.assign({},
                currentUnitThings.resource,
                {
                    contentId: currentUnitThings.resource?.triggerId || '',
                    resourceId: currentUnitThings.resourceId,
                    resourceScenes: currentUnitThings.resourceScenes,
                    ..._triggerValue
                });
            const res = await editResource(_data);
            if (res) {
                message.success('物料提交成功');
            }
        } catch (e) {
            console.log(e);
            alert(e.message);
        }
    };
    useEffect(() => {
        getReviewDetail().then(_supplyUnitThingsMap => {
        });
        // setCurrentUnit(supplyUnitThings[0]);
    }, []);
    return <div className={'g-TriggerSupply'}>
        <Form {...FORM_LAYOUT_SHORTLAB} form={currentUnitForm} className={'TriggerSupplyEditForm'}>
            <div className={'item'}>
                <Item label="链接" name={'actionUrl'}>
                    <Input disabled={isEditable === 0 || (isEditable === 2 && triggerReviewMap?.actionUrl?.reviewResult === 1)} placeholder="请输入文案1" maxLength={200} />
                </Item>
                <div className={'reviewResult'}>
                    {REVIEW_RESULT_MAP_BUILD(triggerReviewMap?.actionUrl?.reviewResult)}
                </div>
            </div>
            <div className={'item'}>
                <Item label="图片" name="imgUrl"
                      extra={'支持 jpg,jpeg,png,gif 图片格式,文件大小不超过1M'}>
                    <UploadImg resourceScenes={resourceScenes} />
                </Item>
                
                <div className={'reviewResult'}>
                    {REVIEW_RESULT_MAP_BUILD(triggerReviewMap?.imgUrl?.reviewResult)}
                </div>
            
            </div>
            <div className="item">
                <Item label="备注" name="triggerDesc">
                    <Input disabled={isEditable === 0 || (isEditable === 2 && triggerReviewMap?.triggerDesc?.reviewResult === 1)} placeholder="请输入备注" maxLength={100} />
                </Item>
                <div className={'reviewResult'} />
            </div>
        </Form>
        <div className={'g-submitUnitThingsBtnsWrap'}>
            <Button type={'primary'} onClick={() => {
                Modal.confirm({
                    title: '请务必确认物料已经经过公司法务综合审核！',
                    icon: <ExclamationCircleOutlined />,
                    okText: '是',
                    cancelText: '否',
                    async onOk () {
                        try {
                            await submit();
                            await getReviewDetail();
                        } catch (e) {
                            if (!e.errorFields && e.message) {
                                Modal.error({ title: e.message });
                            }
                        }
                    }
                });
            }}>提交物料</Button></div>
    </div>;
}
