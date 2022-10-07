/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/10.
 * Copyright 2021/11/10 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/10
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { Input, Radio, Select, TreeSelect, Form } from 'antd';
import { FORM_LAYOUT, RADIO_GROUP_OPTIONS_MSISDN_TYPE_MAP, RADIO_GROUP_OPTIONS_SYSTEM_TYPE_MAP, RADIO_GROUP_OPTIONS_TAG_LABEL } from '../../../common/CONSTANT';
import { COMMON_CONTEXT } from '../../../store';
import { mkDefArray } from '../../../service/utils';
import { useLcrMngOperaters } from '../../../Controllers/useLcrMngOperaters';
import { AttachUpload } from './AttachUpload';
import { uploadAttachFileApi, uploadSpecificUserFile } from '../../../service/api';
import { useCheckAuthRight } from '../../../Controllers/useCheckAuthRight';

const { Item, useForm } = Form;
const { TreeNode } = TreeSelect;
export function BasicInfo_Edit (props) {
    const { state } = useContext(COMMON_CONTEXT);
    const { LcrDependencesData, currentLauncherData } = state;
    const [formEdit] = useForm();
    const [tagValue, setTagValue] = useState(1);
    const LcrOpteraters = useLcrMngOperaters();
    const { checkRight } = useCheckAuthRight();
    useEffect(() => {
        if (currentLauncherData) {
            (async () => {
                formEdit.setFieldsValue(currentLauncherData);
                setTagValue(currentLauncherData.tagType);
                await LcrOpteraters('getFileList');
                props.baseFormRef.current = formEdit;
            })();
        }
    }, [currentLauncherData]);
    return <Form {...FORM_LAYOUT} form={formEdit} className={'g-baseEditForm'}>
        <div className={'formContent'}>
            <Item label="项目名称"
                  name="itemName"
                  rules={[{ required: true, message: '请输入项目名称' }]}>
                <Input placeholder="请输入项目名称" maxLength={40} />
            </Item>
            <Item name="department"
                  label="项目归属部门"
                  rules={[{ required: true, message: '请选择部门' }]}>
                <Select placeholder="请选择部门" allowClear disabled={!checkRight([currentLauncherData?.itemType === 0 ? 2 : 3])}>
                    {(LcrDependencesData?.depList ?? []).map((item, index) => {
                        return <Select.Option key={index} value={item}>
                            {item}
                        </Select.Option>;
                    })}
                </Select>
            </Item>
            <Item name="regionCode"
                  label="投放区域"
                  rules={[{ required: true, message: '请选择投放区域' }]}>
                <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择投放区域"
                    treeDefaultExpandedKeys={['99']}
                    treeCheckable="true"
                    showCheckedStrategy="SHOW_PARENT">
                    {
                        mkDefArray(LcrDependencesData?.cityList).map(nation => {
                            return <TreeNode value={nation.provCode} title={nation.provName} key={nation.provCode}>
                                {
                                    mkDefArray(nation.provinces).map(pro => {
                                        return <TreeNode value={pro.provCode} title={pro.provName} key={pro.provCode}>
                                            {
                                                mkDefArray(pro.cityList).map(city => {
                                                    return <TreeNode value={city.cityCode} title={city.cityName} key={city.cityCode} />;
                                                })
                                            }
                                        </TreeNode>;
                                    })
                                }
                            </TreeNode>;
                        })
                    }
                </TreeSelect>
            </Item>
            <Item name="provCode"
                  label="手机归属地"
                  rules={[{ required: true, message: '请选择手机归属地' }]}>
                <TreeSelect dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择手机归属地"
                            treeDefaultExpandAll
                            treeCheckable="true"
                            showCheckedStrategy="SHOW_PARENT">
                    {
                        mkDefArray(LcrDependencesData.provinceList).map(nation => {
                            return <TreeNode value={nation.provCode} title={nation.provName} key={nation.provCode}>
                                {
                                    mkDefArray(nation.provinces).map(pro => {
                                        return <TreeNode value={pro.provCode} title={pro.provName} key={pro.provCode} />;
                                    })
                                }
                            </TreeNode>;
                        })
                    }
                </TreeSelect>
            </Item>
            <Item
                label="运营商"
                name="msisdnType"
                rules={[{ required: true, message: '请选择运营商' }]}>
                <Radio.Group>
                    {
                        RADIO_GROUP_OPTIONS_MSISDN_TYPE_MAP.map((p, i) => {
                            const { value, label } = p;
                            return <Radio key={i} value={value}>{label}</Radio>;
                        })
                    }
                </Radio.Group>
            </Item>
            <Item
                label="系统类型"
                name="system"
                rules={[{ required: true, message: '请选择系统类型' }]}>
                <Radio.Group>
                    {
                        RADIO_GROUP_OPTIONS_SYSTEM_TYPE_MAP.map((p, i) => {
                            const { value, label } = p;
                            return <Radio key={i} value={value}>{label}</Radio>;
                        })
                    }
                </Radio.Group>
            </Item>
            <Item label="选择版本" className={'c-version'}>
                <Item name="minVersion" label={'最低版本'} rules={[{ required: true, message: '请选择最低版本' }]}>
                    <Select placeholder="请选择最低版本" allowClear>
                        {LcrDependencesData.versionList.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>;
                        })}
                    </Select>
                </Item>
                <Item name="maxVersion" label={'最高版本'} rules={[{ required: true, message: '请选择最高版本' }]}>
                    <Select placeholder="请选择最高版本" allowClear>
                        {LcrDependencesData.versionList.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>;
                        })}
                    </Select>
                </Item>
            </Item>
            <div className={`tagTypeArea ${tagValue !== 1 ? 'bd' : 'nor'}`}>
                <Item label="用户获取"
                      name="tagType"
                      rules={[{ required: true, message: '请选择用户获取' }]}>
                    <Radio.Group
                        options={RADIO_GROUP_OPTIONS_TAG_LABEL}
                        onChange={(e) => setTagValue(e.target.value)} />
                </Item>
                {tagValue === 3 ?
                    <Item
                        label="接口链接"
                        name="tag"
                        rules={[{ required: true, message: '请输入接口链接' }, { pattern: /^(http|https):\/\/([\w.]+\/?)\S*/, message: '接口连接HTTP请求格式错误' }]}>
                        <Input placeholder="请输入接口链接" maxLength={200} />
                    </Item> : null
                }
                {tagValue === 2 ?
                    <Item
                        label="名单"
                        name="tagTxt"
                        extra="支持大小500M以内的txt文件"
                        rules={[{ required: true, message: '请上传名单' }]}>
                        <AttachUpload api={uploadSpecificUserFile} btnText={'上传名单'} maxCount={1} extReg={new RegExp(/.(txt)+$/gi)} extName={'txt'} maxSize={500} />
                    </Item> : null
                }
                {tagValue === 6 ?
                    <Item
                        label="IOP内容"
                        name="tag"
                        rules={[{ required: true, message: '请输入接口链接' }]}>
                        <Input placeholder="请输入接口链接" maxLength={200} />
                    </Item> : null
                }
            </div>
            <Item
                label="附件"
                name="attachUrl"
                extra="支持大小1M以内的文件">
                <AttachUpload btnText={'上传附件'} maxCount={3} api={uploadAttachFileApi} maxSize={1} />
            </Item>
            <Item label="备注"
                  name="itemNote"
                  rules={[{ required: false, message: '请输入备注' }]}>
                <Input placeholder="请输入备注" maxLength={100} />
            </Item>
        </div>
    </Form>;
}
