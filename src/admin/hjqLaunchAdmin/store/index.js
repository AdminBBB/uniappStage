/**
 * File Created by duanmingxue at 2021-05-20.
 * Copyright 2019 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. (Confidential Information). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author duanmingxue
 * @date 2021-05-20
 * @version */
import { createContext } from 'react';
import { TABLE_DEFAULT_PAGESIZE } from '../common/CONSTANT';
import { AUTH_USERID, AUTH_TOKEN } from '../_PLATFORM_COMMON/URL_AS';

export const defaultState = {
    authUserId: AUTH_USERID,
    authToken: AUTH_TOKEN,
    fileListPush: [],
    /*
    *
    * add 汪树岩
    * */
    // 投放管理数据列表依赖
    LcrDependencesData: {
        provinceList: [], // 省份列表
        cityList: [],//城市列表
        depList: [],// 部门列表
        depListFilter: [],//部门列表  {text: '融合通信系统部', value: '融合通信系统部'}
        versionList: [], // 版本列表
        resourceMsg: [], // 资源位置信息
        versionListFilter: [],//版本列表 {text: '4.5.0', value: '4.5.0'}
        patternList: [], // 形态列表
        regionsMap: {} // 地区键值对
    },
    /*
    * 投放表格数据
    */
    LauncherData: [],
    LauncherDataTotal: 0,
    LcrTablePageSize: TABLE_DEFAULT_PAGESIZE,
    LcrTablePageNo: 1,
    LcrTableLoading: false,
    LauncherFilterKeyWord: '',
    LauncherFilterKViewSelf: false,
    /*编辑当前投放*/
    // 操作类型
    // 0-9:新增:{ 0 新增产品投放  1 新增运营投放 }
    // 10-19: 修改（含复制新增） { 10 从投放管理列表修改修改  11：复制   12：从排期管理处修改  13：追加   14：物料  15:更新  }
    // 20-29:查看预览 { 20 查看  21 排期管理查看 22 运营排期管理查看 }
    // 30 { 31 物料审核 }
    operateType: 1,
    currentLauncherData: null,
    // 删除弹窗标识
    deleteModalItemId: null,
    /*
    *
    * 单个投放信息数据
    *
    * */
    rejectModalVisible: false,// 审核驳回窗口显示flag
    currentResourceSupply: null, // 某资源物料的信息储存，便于多个组件传递方便
    /*
    * 排期管理数据中心
    * */
    operateTimes: null,
    currentOperateTime: null,
    viewLauncherInModalByItemId: null,
    // 编辑资源弹窗标识 也是编辑资源的内容存储
    editResourceData: null,
    /*
    *
    *
    * */
    
    /*
   * 通用管理
   * */
    authTypeList: [], //权限类型对应列表 0超级管理，1视觉审核，2产品管理，3运营管理，4产品申请，5运营申请,
    viewUniversalAuthorityItem: null, //通用管理-权限管理-权限弹框
    universalType: 1, // 通用管理，是编辑还是新增，1 新增 2编辑
    currentUniversalAuthorityData: null,
    //权限列表搜索条件
    AuthSearchData: {
        page: 1,
        size: 10,
        searchType: 1,
        searchField: '',
        searchKey: '',
        ascOrder: null
    },
    //白名单列表搜索条件
    WhiteSearchData: {
        page: 1,
        size: 10,
        searchType: 1,
        searchKey: '',
        ascOrder: ''
    },
    viewUniversalWhiteItem: null,//通用管理-白名单管理-白名单弹框
    //超管审核管理列表搜索条件
    AuditSearchData: {
        page: 1,
        size: 10,
        searchType: 1,
        searchKey: '',
        searchField: ''
    },
    viewUniversalAuditItem: null//通用管理-超管审核管理-超管弹框
};
export function reducer (state, data) {
    return { ...state, ...data };
}
export const COMMON_CONTEXT = createContext(null);
