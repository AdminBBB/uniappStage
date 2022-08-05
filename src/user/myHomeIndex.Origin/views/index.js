import React, { useReducer, useEffect } from 'react';
import { initalState, reducer, SERVICE_CONTEXT } from '../api/reducer';
import { TitleMasker } from './TitleMasker/';
import { HomeContent } from './HomeContent/';
import uniappbridge from '@hjq/uniappbridge';
import { DebuggerRender } from './DebuggerRender';

export function Index () {
    const [state, dispatch] = useReducer(reducer, initalState);
    // 新手指引 native回调函数
    // 6.0.0 因为我家布局上的变化暂时下掉
    // useEffect(() => {
    //     uniappbridge.registerHandler('scrollToBottom', (offsetValue, callBack) => {
    //         window.scrollTo({ top: document.documentElement.scrollHeight });
    //         const lastChildPatternsOffsetHeight = document.querySelector('.g-patterns > li:last-child').offsetHeight + 40;
    //         callBack(lastChildPatternsOffsetHeight);
    //     });
    // }, []);
    return <SERVICE_CONTEXT.Provider value={{ state, dispatch }}>
        <TitleMasker />
        <HomeContent />
    </SERVICE_CONTEXT.Provider>;
}
