// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDom from 'react-dom';
import { Help } from './help';
import Tr, { setConfig } from '@hjq/trace';

setConfig({
    project: 'myHomeIndex',
    serverUrl:'6'
});
Tr.vt();

ReactDom.render(
    <div className="g-wrap">
        <Help />
    </div>,
    document.querySelector('#app'));
 
