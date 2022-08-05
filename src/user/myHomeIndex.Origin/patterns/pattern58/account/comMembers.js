/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */

import React, {useState} from 'react';
import {Auth} from '@hjq/uts';
import '../less/members.less';
import gData from '../../../api/data';
const busiDict = gData.busiDict;
export function ComMembers (props) {
    const [selfPhone] = useState(Auth.mobile);
    const ratio_g = (window.document.body.clientWidth || document.documentElement.clientWidth || 375)/375;
    const filterPhone = (phone)=>{
        return phone.substr(7,10);
    }
    return (
        <div className="com-Member-58">
            <ul className='ul-mem'>
                {
                    props.memberList.length<10 && props.isMaster ? (
                        <li onClick={props.addMore}>
                            <div className='li-add' role={'button'} aria-label='添加'>
                                <div className='img-add' aria-hidden={true}> </div>
                                <p aria-hidden={true}>添加</p>
                            </div>
                        </li>
                    ):''
                }

                {props.memberList.map(ele=>(
                    <li key={ele.phone} onClick={()=>{props.goMember(ele)}}>
                        <div className='li-mem'>
                                <div className='img-head'>{ele.shortPhone}
                                </div>
                                <div className='m-text'>
                                    {filterPhone(ele.phone)}
                                </div>
                        </div>
                        <div className={'icon-phone'}></div>
                        {ele.houseHolder?<div className='mem-master'> </div>:''}
                    </li>
                ))
                }
            </ul>
        </div>
    );
}
