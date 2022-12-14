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
            <Item label="????????????"
                  name="itemName"
                  rules={[{ required: true, message: '?????????????????????' }]}>
                <Input placeholder="?????????????????????" maxLength={40} />
            </Item>
            <Item name="department"
                  label="??????????????????"
                  rules={[{ required: true, message: '???????????????' }]}>
                <Select placeholder="???????????????" allowClear disabled={!checkRight([currentLauncherData?.itemType === 0 ? 2 : 3])}>
                    {(LcrDependencesData?.depList ?? []).map((item, index) => {
                        return <Select.Option key={index} value={item}>
                            {item}
                        </Select.Option>;
                    })}
                </Select>
            </Item>
            <Item name="regionCode"
                  label="????????????"
                  rules={[{ required: true, message: '?????????????????????' }]}>
                <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="?????????????????????"
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
                  label="???????????????"
                  rules={[{ required: true, message: '????????????????????????' }]}>
                <TreeSelect dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="????????????????????????"
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
                label="?????????"
                name="msisdnType"
                rules={[{ required: true, message: '??????????????????' }]}>
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
                label="????????????"
                name="system"
                rules={[{ required: true, message: '?????????????????????' }]}>
                <Radio.Group>
                    {
                        RADIO_GROUP_OPTIONS_SYSTEM_TYPE_MAP.map((p, i) => {
                            const { value, label } = p;
                            return <Radio key={i} value={value}>{label}</Radio>;
                        })
                    }
                </Radio.Group>
            </Item>
            <Item label="????????????" className={'c-version'}>
                <Item name="minVersion" label={'????????????'} rules={[{ required: true, message: '?????????????????????' }]}>
                    <Select placeholder="?????????????????????" allowClear>
                        {LcrDependencesData.versionList.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>;
                        })}
                    </Select>
                </Item>
                <Item name="maxVersion" label={'????????????'} rules={[{ required: true, message: '?????????????????????' }]}>
                    <Select placeholder="?????????????????????" allowClear>
                        {LcrDependencesData.versionList.map((item, index) => {
                            return <Select.Option key={index} value={item}>
                                {item}
                            </Select.Option>;
                        })}
                    </Select>
                </Item>
            </Item>
            <div className={`tagTypeArea ${tagValue !== 1 ? 'bd' : 'nor'}`}>
                <Item label="????????????"
                      name="tagType"
                      rules={[{ required: true, message: '?????????????????????' }]}>
                    <Radio.Group
                        options={RADIO_GROUP_OPTIONS_TAG_LABEL}
                        onChange={(e) => setTagValue(e.target.value)} />
                </Item>
                {tagValue === 3 ?
                    <Item
                        label="????????????"
                        name="tag"
                        rules={[{ required: true, message: '?????????????????????' }, { pattern: /^(http|https):\/\/([\w.]+\/?)\S*/, message: '????????????HTTP??????????????????' }]}>
                        <Input placeholder="?????????????????????" maxLength={200} />
                    </Item> : null
                }
                {tagValue === 2 ?
                    <Item
                        label="??????"
                        name="tagTxt"
                        extra="????????????500M?????????txt??????"
                        rules={[{ required: true, message: '???????????????' }]}>
                        <AttachUpload api={uploadSpecificUserFile} btnText={'????????????'} maxCount={1} extReg={new RegExp(/.(txt)+$/gi)} extName={'txt'} maxSize={500} />
                    </Item> : null
                }
                {tagValue === 6 ?
                    <Item
                        label="IOP??????"
                        name="tag"
                        rules={[{ required: true, message: '?????????????????????' }]}>
                        <Input placeholder="?????????????????????" maxLength={200} />
                    </Item> : null
                }
            </div>
            <Item
                label="??????"
                name="attachUrl"
                extra="????????????1M???????????????">
                <AttachUpload btnText={'????????????'} maxCount={3} api={uploadAttachFileApi} maxSize={1} />
            </Item>
            <Item label="??????"
                  name="itemNote"
                  rules={[{ required: false, message: '???????????????' }]}>
                <Input placeholder="???????????????" maxLength={100} />
            </Item>
        </div>
    </Form>;
}
