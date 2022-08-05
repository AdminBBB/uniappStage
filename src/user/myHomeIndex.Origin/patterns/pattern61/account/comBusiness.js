/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */
import React from 'react';
import '../less/members.less';

export function ComBusiness (props) {
    return (
        <ul className="ul-busi">
            {props.functionList.map(ele => (
                <li className='li-busi' key={ele.serviceName} onClick={() => {
                    props.clickBusi(ele);
                }}>
                    <div className='img-head'><img src={ele.serviceIcon} alt='avatar' /></div>
                    <div className='t-name'>{ele.serviceTitle}</div>
                </li>
            ))
            }
        </ul>
    );
}
