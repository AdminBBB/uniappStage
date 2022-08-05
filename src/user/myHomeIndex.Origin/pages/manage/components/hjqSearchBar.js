/**
 * @Desc
 * @author hufangqin
 * @date 2021/2/1
 * @version */

/**
 * @Desc
 * @author hufangqin
 * @date 2021/1/19
 * @version */

import React, {useEffect, useState} from 'react';
import './hjqSearchBar.less';
import { InputItem } from 'antd-mobile';
import {Ua} from '@hjq/uts'


export function HjqSearch (props) {
    const [svalue, setSvalue] = useState('');
    const [hide, setHide ] = useState(true);

    const onChange = async (e) => {
        let val = e.currentTarget.value || '';
        setSvalue(val);
       props.onChange && props.onChange(val);
    }
 

    function clear () {
        setSvalue('');
        props.onChange && props.onChange('');
    }
    function focus() {
        setHide(false);
       // console.log(hide);
    }
    function search() {
// setHide(true);
    }
    return (
       <div className='hjq-search'>
           <div className='searchInput'>
               <input value={svalue} className='u-input' placeholder='搜索' onChange={onChange} onFocus={focus}/>
               {!svalue ? '' : <div className='searchClear' onClick={clear}> </div>}

           </div>

           <div className={'searchSure ' + (hide? 'hide' : '')} onClick={search}>搜索</div>
       </div>
    );
}
