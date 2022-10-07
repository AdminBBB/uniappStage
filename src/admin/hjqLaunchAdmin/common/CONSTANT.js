/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/9.
 * Copyright 2021/11/9 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/9
 * @version */
/* 数据 字典 常量 */
export const ITEM_TYPE_TXT = ['产品', '运营'];
export const SUPER_ITEM_TYPE_TXT = ['产品/运营', '产品', '运营'];
export const ITEM_TYPE_CONFIGNAME = ['pm', 'om'];
export const SYSTEM_TYPE_TXT = ['', 'IOS', 'Android', '全部系统'];
export const ITEM_STATUS_TXT = ['', '已保存未提交', '已提交未确认', '已提交已驳回', '物料待提交', '已生效待上线', '已生效已上线', '已生效已下线', '已失效'];
export const REVIEW_TXT = ['未生效', '不适用', '未提交', '待审核', '未通过', '已通过'];
export const TAG_TYEP_TEXT = ['', '自动', '名单', '接口', '', '', 'IOP'];
export const GRAY_STATUS_TXT = ['关闭', '测试'];
export const modalTitleText = ['产品投放申请', '运营投放申请'];
/* 静态常量 */
export const DEFAULT_PAGE_NO = 0;
export const TABLE_DEFAULT_PAGESIZE = 12;
export const TABLE_DEFAULT_PAGE_NO = 1;
export const TABLE_PAGESIZE_OPTION = ['12', '15', '20', '30', '40'];
/*  数据模板 */
export const DEFAULT_CURRENT_LAUNCHER_DATA = {
    resourceList: []
};
export const MIN_DATE_UNIT_DIC = ['object', 'array'];
export const FORM_LAYOUT = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
};
export const DATE_FORMDATE_TIME = 'YYYY-MM-DD HH:mm';
export const DATE_FORMDATE_TIMESS = 'YYYY-MM-DD HH:mm:ss';
export const DATE_FORMDATE_DATE = 'YYYY-MM-DD';
export const OP_TIME_STATUS_TXT = ['全部', '已保存', '已提交', '已发布'];
export const AUTH_LIST_DATA_TXT = ['超级管理', '视觉审核', '产品管理', '运营管理', '产品申请', '运营申请'];
/* 排期管理常量 */
export const DEFAULT_DATA_FILTER_DATA = {
    page: TABLE_DEFAULT_PAGE_NO,
    size: TABLE_DEFAULT_PAGESIZE,
    department: '',
    timeSort: 0
};
/*
*
* */
export const AUTH_TYPE_MAP = {
    0: { l: 0, c: 'admin' },// 超级管理员  authtype : localAuthtype
    1: { l: 1, c: 'ui' },// 视觉审核
    2: { l: 2, c: 'admin' },// 产品管理
    3: { l: 3, c: 'admin' },// 运营管理
    4: { l: 4, c: 'applicant' },// 产品申请
    5: { l: 5, c: 'applicant' }// 运营申请
};
export const DEFAULT_CURRENT_DATA = {
    attachUrl: '',
    itemName: null,
    department: null,
    regionCode: [],
    provCode: [],
    system: 3,
    minVersion: null,
    maxVersion: null,
    msisdnType: '3',
    tagType: 1,
    tagTxt: '',
    itemNote: '',
    tag: ''
};
export const RADIO_GROUP_OPTIONS_MSISDN_TYPE_MAP = [
    { value: '3', label: '全部' },
    { value: '0', label: '中国移动' },
    { value: '1', label: '中国电信' },
    { value: '2', label: '中国联通' }
];
export const RADIO_GROUP_OPTIONS_SYSTEM_TYPE_MAP = [
    { value: 3, label: '全部' },
    { value: 1, label: 'iOS' },
    { value: 2, label: 'Android' }
];
export const RADIO_GROUP_OPTIONS_TAG_LABEL = [
    { label: '自动', value: 1 },
    { label: '接口', value: 3 },
    { label: '名单', value: 2 },
    { label: 'IOP', value: 6 }];
