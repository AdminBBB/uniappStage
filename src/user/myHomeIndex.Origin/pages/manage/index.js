// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDom from 'react-dom';
import { Manage } from './manage.js';
import { Info } from './info.js';
import { Add } from './add.js';
import { AddByMember } from './addByMember.js';
import { AddrList } from './addrList.js';
import { Busi } from './busi.js';
import Tr, { setConfig } from '@hjq/trace';
import { HashRouter, Route } from 'react-router-dom';

if (process.env.NODE_ENV !== 'production') {
        var VConsole = require('vconsole');
        var vConsole = new VConsole();
}
setConfig({
    project: 'myHomeIndex',
    serverUrl: '6'
});
Tr.vt();
ReactDom.render(
    (<HashRouter>
        <Route path='/' exact component={Manage} />
        <Route path='/manage' exact component={Manage} />
        <Route path='/info/:phone' exact component={Info} />
        <Route path='/add/:fromPage?' exact component={Add} />
        <Route path='/addByMember/:fromPage?' exact component={AddByMember} />
        <Route path='/addrList' exact component={AddrList} />
        <Route path='/busi' exact component={Busi} />

    </HashRouter>),
    document.querySelector('#app'));
 
