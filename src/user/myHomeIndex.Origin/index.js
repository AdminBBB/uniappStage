import './global.less';
import React from 'react';
import ReactDom from 'react-dom';
/* api */
import { initalState } from './api/reducer.js';
import { initRenderData } from './api/home.js';
/* views */
import { Index } from './views/';
import { ErrorToLoad } from './views/ErrorToLoad';
import { OutHjq } from './views/OutHjq';
import Tr, { setConfig } from '@hjq/trace';
import vConsole from 'vconsole';

new vConsole();
/* initReact */
function initReact (result) {
    const { state, err } = result;
    let $render = null;
    switch (state) {
        case 0:
            $render = <OutHjq />;
            break;
        case 2:
            $render = <Index />;
            break;
        default:
            $render = <ErrorToLoad err={err} />;
            break;
    }
    ReactDom.render($render, document.querySelector('#app'));
    Tr.vt();
}
/* init page */

(async () => {
    try {
        const renderData = await initRenderData();
        Object.assign(initalState, renderData);
        const { USER_INFO: { userSelectProviceCode, userSelectCityCode, provCode, cityCode } } = initalState;
        setConfig({
            project: 'myHomeIndex',
            serverUrl: '6',
            parameters: { userSelectProviceCode, userSelectCityCode, provCode, cityCode }
        });
        initReact({
            state: 2
        });
    } catch (e) {
        initReact(e);
    }
})();

