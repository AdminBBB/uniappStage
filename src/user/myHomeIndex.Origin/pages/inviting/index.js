// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDom from 'react-dom';
import { Inviting } from './inviting';
import Tr, { setConfig } from '@hjq/trace';

setConfig({
    project: 'myHomeIndex',
    serverUrl:'6'
});
Tr.vt();
document.title = '家人邀请';

ReactDom.render(
    <div className="g-wrap">
        <Inviting />
    </div>,
    document.querySelector('#app'));
 
