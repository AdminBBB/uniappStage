/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/11.
 * Copyright 2021/11/11 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/11
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { DatePicker, Form, Input, Select, Modal } from 'antd';
import { COMMON_CONTEXT } from '../../../store';
import { getNodeDate, mkDefArray } from '../../../service/utils';
import { MIN_DATE_UNIT_DIC } from '../../../common/CONSTANT';
import moment from 'moment';
import { useUtils } from '../../../Controllers/useUtils';
import { useErrorModal } from '../../../Controllers/useErrorModal';
import { FORM_LAYOUT } from '../common';

const { useForm, Item } = Form;
const { RangePicker } = DatePicker;
const { Option } = Select;
export function ResourceBasicInfo_Edit () {
    // data from store
    const { state, dispatch } = useContext(COMMON_CONTEXT);
    const { currentLauncherData, LcrDependencesData: { patternList }, editResourceData } = state;
    const { resourceInfoList = [], resourcesMap, resourcesMapExt } = currentLauncherData || {};
    // data from props
    // local defined
    const [resourceForm] = useForm();
    const [resourceName, setResourceName] = useState('');
    const [resourceOriginContent, setResourceOriginContent] = useState({});
    const [ordersList, setOrdersList] = useState(null);
    const [minDateUnit, setMinDateUnit] = useState();
    const [location, setLocation] = useState();
    const [RangeDates, setRangeDates] = useState([]);
    const rUtils = useUtils();
    const ModalError = useErrorModal();
    const RangeDisabledDateComplex = (current) => {
        const maxPreCount = resourceOriginContent?.resourceStyle?.maxPreCount ?? 0;
        if (!RangeDates || RangeDates.length === 0 || maxPreCount === 0) {
            return false;
        }
        const tooLate = RangeDates[0] && current.diff(RangeDates[0], 'days') > maxPreCount;
        const tooEarly = RangeDates[1] && RangeDates[1].diff(current, 'days') > maxPreCount;
        return tooEarly || tooLate;
    };
    const resourceChange = (changeValues) => {
        let _resourceOriginContent = Object.assign({}, resourceOriginContent, changeValues);
        for (const changeValue of Object.entries(changeValues)) {
            const [k, v] = changeValue;
            switch (k) {
                case 'resourceName':
                    _resourceOriginContent = resourceNameChange(v, _resourceOriginContent);
                    break;
                case 'rangePicker':
                    if (Array.isArray(v)) {
                        const [preBeginTime, preEndTime] = v;
                        _resourceOriginContent.preBeginTime = preBeginTime;
                        _resourceOriginContent.preEndTime = preEndTime;
                    } else {
                        _resourceOriginContent.preBeginTime = v;
                    }
                    Object.assign(_resourceOriginContent, changeValues);
                    break;
                default:
                    Object.assign(_resourceOriginContent, changeValues);
                    break;
            }
        }
        setResourceOriginContent(_resourceOriginContent);
        resourceForm.setFieldsValue(_resourceOriginContent);
    };
    const resourceNameChange = (resourceName, resourceOrigin) => {
        setResourceName(resourceName);
        const resourceStyle = rUtils('ResourceCateMatch', resourceName);
        const { orders, location, minDateUnit } = resourceStyle;
        const { preBeginTime, preEndTime } = resourceOrigin;
        let rangePicker = null, _resconfigId = null;
        if (preBeginTime) {
            rangePicker = minDateUnit === 0 ? moment(preBeginTime) : [moment(preBeginTime), moment(preEndTime || preBeginTime)];
        }
        const _orderList = mkDefArray(orders);
        if (_orderList.length === 1) {
            _resconfigId = _orderList[0].id;
        }
        setOrdersList(_orderList);
        setMinDateUnit(minDateUnit);
        setLocation(location);
        return Object.assign({}, resourceOrigin, {
            rangePicker, resconfigId: _resconfigId, resourceStyle
        });
    };
    const setInitalValues = (resourceOrigin) => {
        const { resourceName } = resourceOrigin;
        let resourceOrigin_r = {};
        if (resourceName) {
            resourceOrigin_r = resourceNameChange(resourceName, resourceOrigin);
            resourceForm.setFieldsValue(resourceOrigin_r);
        }
        setResourceOriginContent(Object.assign({}, resourceOrigin, resourceOrigin_r));
    };
    const cancelEdit = () => {
        resourceForm.resetFields();
        setResourceName('');
        dispatch({
            editResourceData: null
        });
    };
    const submitEditResource = async () => {
        try {
            const { rangePicker, resconfigId, resourceName, resourceNote, patternId } = await resourceForm.validateFields();
            const updateResource = { id: resourceOriginContent.id, resconfigId, resourceName, resourceNote, resourceStyle: resourceOriginContent.resourceStyle };
            patternId && (updateResource.patternId = patternId);
            let preBeginTime = null, preEndTime = null;
            if (Array.isArray(rangePicker)) {
                const [_preBeginTime, _preEndTime] = rangePicker;
                preBeginTime = getNodeDate(moment(_preBeginTime).valueOf(), 0).value;
                preEndTime = getNodeDate(moment(_preEndTime).valueOf(), 1).value;
            } else {
                preEndTime = preBeginTime = moment(rangePicker).valueOf();
            }
            updateResource.preBeginTime = preBeginTime;
            updateResource.preEndTime = preEndTime;
            let newResourcesMap;
            if (resourcesMap?.[updateResource.id]) {
                const newResource = Object.assign({}, resourcesMap[updateResource.id], updateResource);
                newResourcesMap = { resourcesMap: Object.assign(resourcesMap, { [updateResource.id]: newResource }) };
            } else {
                updateResource.isExtResource = true;
                const newResource = Object.assign({}, resourcesMapExt?.[updateResource.id] ?? {}, updateResource);
                newResourcesMap = {
                    resourcesMapExt: Object.assign(resourcesMapExt, { [updateResource.id]: newResource })
                };
            }
            dispatch({
                currentLauncherData: Object.assign({}, currentLauncherData, newResourcesMap)
            });
            cancelEdit();
            Modal.success({ title: '操作成功' });
        } catch (e) {
            console.log(e);
            if (!(Array.isArray(e.errorFields) && e.errorFields.length > 0) && e?.message) {
                ModalError(e?.message);
            }
        }
    };
    useEffect(() => {
        if (editResourceData) {
            setInitalValues(editResourceData);
        }
    }, [editResourceData]);
    return <Modal className={'g-resourceFormContainer'}
                  width={720}
                  maskClosable={false}
                  title={(editResourceData?.resourceName ? '编辑' : '新增') + '资源'}
                  visible={editResourceData}
                  okText={'确定'}
                  cancelText={'取消'}
                  onOk={submitEditResource}
                  onCancel={cancelEdit}
                  destroyOnClose>
        <Form  {...FORM_LAYOUT} form={resourceForm} name="resourceForm" onValuesChange={resourceChange} initialValues={{}}>
            <Item name="resourceName"
                  label="资源选择"
                  rules={[{ required: true, message: '请选择资源' }]}>
                <Select placeholder="请选择资源">
                    {resourceInfoList.map((item, index) => <Option key={index} value={item.resourceName}>{item.resourceName}</Option>)}
                </Select>
            </Item>
            {resourceName && <>
                <Item name="rangePicker" label="上线时间"
                      rules={[{
                          type: MIN_DATE_UNIT_DIC[minDateUnit || 0], required: true, message: '请选择上线时间!'
                      }]}>
                    {minDateUnit === 0 ? <DatePicker showTime={true} /> : <RangePicker disabledDate={RangeDisabledDateComplex}
                                                                                       onCalendarChange={val => setRangeDates(val)} />}
                </Item>
                <Item name="resconfigId"
                      label="顺序选择"
                      rules={[{ required: true, message: '请选择顺序!' }]}>
                    <Select placeholder="请选择顺序" allowClear disabled={ordersList.length <= 1}>
                        {ordersList.map((item) => <Option key={item.id} value={item.id}>{item.resourceOrder}</Option>)}
                    </Select>
                </Item>
                {location && <Item name="patternId" label="形态选择" rules={[{ required: true, message: '请选择形态!' }]}>
                    <Select placeholder="请选择形态" allowClear>
                        {patternList && patternList.map((item, index) => <Option key={index} value={+item.patternId}>{item.name}</Option>)}
                    </Select>
                </Item>}
                <Item name="resourceNote"
                      label="备注">
                    <Input placeholder="请输入备注" maxLength={100} />
                </Item>
            </>}
        </Form>
    </Modal>;
}
