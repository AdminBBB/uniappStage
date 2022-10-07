/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/10/20.
 * Copyright 2021/10/20 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/10/20
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { ModuleList } from './ModuleList';
import { AppstoreOutlined } from '@ant-design/icons';

function decomposeData (modules, moduleInfo) {
    const { idKeyName = 'moduleId', parentIdKeyName = null } = moduleInfo;
    let modulesSort = modules.sort((m1, m2) => m1.id - m2.id);
    const modulesMap = {};
    const moduleTree = {};
    for (const module of modulesSort) {
        modulesMap[module[idKeyName]] = module;
    }
    for (const module of modulesSort) {
        if (module[idKeyName]) { // 有的值是null
            if (parentIdKeyName && module[parentIdKeyName]) {
                if (modulesMap[module[parentIdKeyName]]) {
                    const parentModule = modulesMap[module[parentIdKeyName]];
                    module.parentsList = [...parentModule.parentsList, module[parentIdKeyName]];
                    parentModule.children = parentModule.children || [];
                    parentModule.children.push(module);
                }
            } else {
                module.parentsList = [];
                module.children = [];
                moduleTree[module[idKeyName]] = module;
            }
        }
    }
    return {
        modulesSort,
        moduleTree: Object.values(moduleTree),
        modulesMap
    };
}
export function ModulesAs (props) {
    const { modules, moduleInfo } = props;
    const [modulesData, setModulesData] = useState({
        modulesSort: [],
        moduleTree: [],
        modulesMap: {}
    });
    const [currentModuleId, setCurrentModuleId] = useState(null);
    const [currentModule, setCurrentModule] = useState(null);
    useEffect(() => {
        const _modulesData = decomposeData(modules, moduleInfo);
        setModulesData(_modulesData);
        setCurrentModule(_modulesData.modulesMap[currentModuleId]);
    }, [modules]);
    useEffect(() => {
        setCurrentModule(modulesData.modulesMap[currentModuleId]);
    }, [currentModuleId]);
    return <div className={'g-moduleList'}>
        {moduleInfo.parentIdKeyName && <ul className={'module-nav'}>
            <li onClick={() => setCurrentModuleId(null)}><AppstoreOutlined /><span style={{ fontSize: '14px', marginLeft: '8px', fontWeight: 400 }}>全部模块</span></li>
            {(currentModule && currentModule.parentsList || []).map((m, index) => {
                return <li key={index} onClick={() => setCurrentModuleId(m)}>{m}</li>;
            })}
            {currentModule ? <li>  {currentModule[moduleInfo.h2TitleKey]} ---- {currentModule[moduleInfo.h3TitleKey]} </li> : ''}
        </ul>}
        <ModuleList modules={currentModule && currentModule.children || modulesData.moduleTree} moduleInfo={moduleInfo} setCurrentModuleHandler={setCurrentModuleId} />
    </div>;
}
