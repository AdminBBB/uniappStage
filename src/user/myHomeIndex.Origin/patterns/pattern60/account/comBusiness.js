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
                <li className='li-busi' key={ele.serviceName} role={'button'} aria-label={ele.serviceTitle} onClick={() => {
                    props.clickBusi(ele);
                }}>
                    <div className='img-head'><img aria-hidden={true} src={ele.serviceIcon} alt={ele.serviceTitle} /></div>
                    <div className='t-name' aria-hidden={true}>{ele.serviceTitle}</div>
                </li>
            ))
            }
        </ul>
    );
}
