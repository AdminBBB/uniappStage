// eslint-disable-next-line no-unused-vars
import React from 'react';
import { gotoUrl } from '../../api/utils.js';
import Tr from '@hjq/trace';

export default function Pattern38 (props) {
    const { content, bannerId = '' } = props.data;
    return <div className="patterns-content">
        {content.map(c => {
            return (<figure className="m-orderfigure" key={c.unitId} onClick={() => {
                Tr.et('content_gotoAction', {
                    bannerId,
                    unitName:c.unitName,
                    placeId: c.placeId,
                    unitId: c.unitId,
                    actionUrl: encodeURIComponent(c.actionUrl)
                });
                setTimeout(() => {
                    gotoUrl(c.actionUrl);
                }, 100);
            }}>
                <img src={c.backgroundUrl} alt={c.unitName} />
            </figure>);
        })}
    </div>;
};
