/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/27.
 * Copyright 2022/1/27 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/27
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Form, Modal, Input } from 'antd';
import { UploadImg } from './UploadImg';
import { FORM_LAYOUT, REVIEW_RESULT_MAP_BUILD } from '../../common';

const { Item } = Form;
export function UnitThingEdit (props) {
    const { editUnitThingVisible, editUnitThing, resourceScenes, resourceStyle, modalSubmitHandler } = props;
    const { unitTitle, unitSubtitle, extrInfo } = resourceStyle;
    const { unitReviewMap } = editUnitThing || {};
    /*
    * reviewResult 	 审核结果 0：未审核 1：通过 2：驳回
    * 驳回状态输入框disabled
    *  */
    const [currentUnitForm] = Form.useForm();
    const submitUnit = async () => {
        const spplyUnit = await currentUnitForm.validateFields();
        const _editUnitThing = Object.assign({}, editUnitThing, spplyUnit);
        modalSubmitHandler('submit', _editUnitThing);
        currentUnitForm.resetFields();
    };
    useEffect(() => {
        const _editUnitThing = Object.assign({},
            {
                unitTitle: null,
                unitSubtitle: null,
                imgUrl: null,
                actionUrl: null,
                extrInfo: null
            }, editUnitThing || {});
        currentUnitForm.setFieldsValue(_editUnitThing);
    }, [editUnitThing]);
    return <Modal visible={editUnitThingVisible}
                  width={640}
                  title={'新增子项'}
                  onOk={submitUnit}
                  onCancel={async () => await modalSubmitHandler('close')}>
        <Form {...FORM_LAYOUT} name={'currentUnitForm'}
              form={currentUnitForm} className={'g-editUnitForm'}>
            {
                unitTitle &&
                <div className={'item'}>
                    <Item label="文案1" name={'unitTitle'}>
                        <Input disabled={unitReviewMap?.unitTitle?.reviewResult === 1} placeholder="请输入文案1" maxLength={200} />
                    </Item>
                    <div className={'reviewResult'}>
                        {REVIEW_RESULT_MAP_BUILD(unitReviewMap?.unitTitle?.reviewResult)}
                    </div>
                </div>
            }
            {
                unitSubtitle &&
                <div className={'item'}>
                    <Item label="文案1" name={'unitSubtitle'}>
                        <Input disabled={unitReviewMap?.unitSubtitle?.reviewResult === 1} placeholder="请输入文案2" maxLength={200} />
                    </Item>
                    <div className={'reviewResult'}>
                        {REVIEW_RESULT_MAP_BUILD(unitReviewMap?.unitSubtitle?.reviewResult)}
                    </div>
                </div>
            }
            <div className={'item'} style={{ minHeight: '160px' }}>
                <Item label="图片" name="imgUrl"
                      extra={'支持 jpg,jpeg,png,gif 图片格式,文件大小不超过1M'}>
                    <UploadImg resourceScenes={resourceScenes} />
                </Item>
                <div className={'reviewResult'}>
                    {REVIEW_RESULT_MAP_BUILD(unitReviewMap?.imgUrl?.reviewResult)}
                </div>
            </div>
            <div className="item">
                <Item label="链接" name="actionUrl">
                    <Input disabled={unitReviewMap?.actionUrl?.reviewResult === 1} placeholder="请输入链接" maxLength={200} />
                </Item>
                <div className={'reviewResult'}>
                    {REVIEW_RESULT_MAP_BUILD(unitReviewMap?.actionUrl?.reviewResult)}
                </div>
            </div>
            {
                extrInfo &&
                <div className="item">
                    <Item label="备注" name="extrInfo">
                        <Input disabled={unitReviewMap?.extrInfo?.reviewResult === 1} placeholder="请输入备注" maxLength={200} />
                    </Item>
                    <div className={'reviewResult'} />
                </div>
            }
        </Form> </Modal>;
}
