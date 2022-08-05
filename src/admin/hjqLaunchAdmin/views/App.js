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
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useReducer } from 'react';
import { COMMON_CONTEXT, defaultState, reducer } from '../store';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { GlobalTop } from '../../_PLATFORM_COMMON/GlobalTop';
import { ViewLauncherItemModal } from '../components/ViewLauncherItemModal';
import router from './router';

export function App () {
    const [state, dispatch] = useReducer(reducer, defaultState);
    return <COMMON_CONTEXT.Provider value={{ state, dispatch }}>
        <div className={'g-launthGlobalWrap'}>
            <div className={'g-globalTop'}>
                <GlobalTop title={'和家亲投放管理后台'}>
                    <div className={'globalTop-authType'}>
                        【 {state?.authName} 】
                    </div>
                </GlobalTop>
            </div>
            {!isNaN(state?.authType) ?
                <>
                    <div className={'g-pageContainer'}>
                        <HashRouter>
                            <Routes>
                                {router.map((r, i) => {
                                    const { path, RouteComponent } = r;
                                    return <Route key={i} path={path} element={<RouteComponent />}></Route>;
                                })}
                            </Routes>
                        </HashRouter>
                    </div>
                    <ViewLauncherItemModal comment={'查看投放详情列表'} />
                </> :
                <div className={'g-pageContainer'}>
                    <div className={'hasNoRight'}>未分配任何使用权限，请联系管理员分配使用权限</div>
                </div>
            }
        </div>
    </COMMON_CONTEXT.Provider>;
}
