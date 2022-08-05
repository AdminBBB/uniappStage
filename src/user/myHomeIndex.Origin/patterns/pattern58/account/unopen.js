/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */
import React, { useContext } from 'react';
import Tr from '@hjq/trace';
import '../less/members.less';
import {openH5UrlV2} from  '@hjq/openHjqUrl';
import { SERVICE_CONTEXT } from '../../../api/reducer.js';

export function MemberUnopen (props) {
    const { state: { familyData }, dispatch } = useContext(SERVICE_CONTEXT);

    const goLink = (ele) => {
        if (!ele.actionUrl) {
            return;
        }
        Tr.et('main_click_unopenBanner'); // myHomeIndex_main_click_unopenBanner
        openH5UrlV2({ web: ele.actionUrl}, { bridgeOpen: true});
    };

    return (
        <div className="members-unopen-wrap-58">
            {
                props.content && props.content.length ?
                    <img alt='未开通' src={props.content[0].backgroundUrl || props.content[0].imgUrl} onClick={()=>{goLink(props.content[0])}}/>: null
            }

        </div>
    );
}
