/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */

import React, {useState} from 'react';
import {Auth} from '@hjq/uts';
import '../less/members.less';
import gData from '../../../api/data';
export function ComMembersYN (props) {
    const [selfPhone] = useState(Auth.mobile);
    const ratio_g = (window.document.body.clientWidth || document.documentElement.clientWidth || 375)/375;
    // const ratio_g = 1;
    const filterPhone = (phone)=>{
        return phone.substr(0,3) + '****' + phone.substr(7,10);
    }
    return (
        <div className="com-Member yn">
            <ul className='ul-mem'>
                {props.memberList.map(ele=>(
                    <li key={ele.phone}>
                        <div className='li-mem'>
                            <div className='m-top'>
                                <div className='img-head'><img src={ele.avatar} alt={filterPhone(ele.phone)}/></div>
                                <div className='m-text'>
                                    <p> {filterPhone(ele.phone)} </p>
                                    <p className='p2'>{props.isMaster ? '主卡' :'副卡'}</p>
                                </div>
                            </div>
                        </div>
                        {ele.isOwner?<div className='mem-master'> </div>:''}
                        {/*{ele.memberStatus===2? <div className='mem-inviting'>邀请中</div> : ''}*/}
                    </li>
                ))
                }
            </ul>
        </div>
    );
}
