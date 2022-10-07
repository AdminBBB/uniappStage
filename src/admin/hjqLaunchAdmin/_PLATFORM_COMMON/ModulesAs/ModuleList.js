/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/8/12.
 * Copyright 2021/8/12 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/8/12
 * @version */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ItemBtn } from './ItemBtn';
import { ApartmentOutlined } from '@ant-design/icons';

export function ModuleList (props) {
    const { modules, moduleInfo, setCurrentModuleHandler } = props;
    const { h2TitleKey, h3TitleKey, titleHandler, operateLeft, operateRight, idKeyName } = moduleInfo;
    return <ul className={'m-modules-list'}>
        {(modules || []).map((module, index) => {
            const children = (Array.isArray(module.children) && module.children.length > 0) ? module.children : null;
            return <li key={index}>
                <div className={'moduleContainer'}>
                    <div className={`moduleContent ${!titleHandler && 'noActive'}`} onClick={() => {
                        const handlerResult = typeof titleHandler === 'function' && titleHandler(module);
                        if (handlerResult === false && children) {
                            setCurrentModuleHandler(module[idKeyName]);
                        }
                    }}>
                        {h2TitleKey && <h2 className={'module_name'}>{module[h2TitleKey]}</h2>}
                        {h3TitleKey && <h3 className={'module_id'}>{module[h3TitleKey]}</h3>}
                    </div>
                    <div className={'module_operates'}>
                        <div className={'operate-left'}>
                            {(operateLeft || []).map((o, index) => {
                                const { vkey, tooltip, icon, handler, visible, compareKey } = o;
                                return <ItemBtn key={index}
                                                visible={visible}
                                                compareKey={compareKey}
                                                vkey={vkey}
                                                data={module}
                                                tooltip={tooltip}
                                                handler={handler}>
                                    {icon}
                                </ItemBtn>;
                            })}
                        </div>
                        <div className={'operate-right'}>
                            {(operateRight || []).map((o, index) => {
                                const { vkey, tooltip, icon, handler, visible, compareKey } = o;
                                return <ItemBtn key={index} visible={visible} compareKey={compareKey} vkey={vkey} data={module} tooltip={tooltip} handler={handler}>
                                    {icon}
                                </ItemBtn>;
                            })}
                            <ItemBtn visible={children}
                                     data={module}
                                     tooltip={'子模块'}
                                     handler={(m) => setCurrentModuleHandler(m[idKeyName])}>
                                <ApartmentOutlined />
                            </ItemBtn>
                        </div>
                    </div>
                </div>
            </li>;
        })}
    </ul>;
}
