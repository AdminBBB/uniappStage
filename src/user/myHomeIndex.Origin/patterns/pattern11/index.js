// eslint-disable-next-line no-unused-vars
import React from 'react';
import { gotoUrl } from '../../api/utils.js';
import Tr from '@hjq/trace';

export default function Pattern11 (props) {
    const { content, bannerId = '', placeId = '' } = props.data;
    return <div className="patterns-content">
        {content.map(c => {
            const { backgroundUrl, actionUrl, unitId, unitName } = c;
            return (<figure className="m-orderfigure" key={unitId} onClick={() => {
                Tr.et('content_gotoAction', {
                    bannerId,
                    unitName,
                    placeId: placeId,
                    unitId: unitId,
                    actionUrl: encodeURIComponent(actionUrl)
                });
                setTimeout(() => {
                    gotoUrl(actionUrl);
                }, 100);
            }}>
                <img src={backgroundUrl} alt={unitName} />
            </figure>);
        })}
    </div>;
};
