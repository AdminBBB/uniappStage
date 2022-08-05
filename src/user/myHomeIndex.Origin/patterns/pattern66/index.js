import './style.less';
import 'swiper/swiper.less';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import Tr from '@hjq/trace';
import { gotoUrl } from '../../api/utils';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Pattern67 (props) {
    const { content, bannerId = '', placeId, backgroundImg } = props.data;
    const patterns66SwipeStyle = {};
    if (backgroundImg) {
        patterns66SwipeStyle.backgroundImage = `url(${backgroundImg})`;
    }
    return <div className={'patterns-content patterns66'}>
        <div className={'swipeContainer'} style={patterns66SwipeStyle}>
            <Swiper
                slidesOffsetBefore={8}
                slidesOffsetAfter={10}
                slidesPerView={2.8}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}>
                {content.map((c, index) => {
                    return <SwiperSlide key={index}>
                        <figure className={'contentImg'}>
                            <img src={c.imgUrl} alt={c.unitName} onClick={() => {
                                Tr.et('content_gotoAction', {
                                    bannerId,
                                    unitName: c.unitName,
                                    placeId: placeId,
                                    unitId: c.unitId,
                                    actionUrl: encodeURIComponent(c.actionUrl)
                                });
                                gotoUrl(c.actionUrl);
                            }} />
                        </figure>
                    </SwiperSlide>;
                })}
            </Swiper>
        </div>
    </div>;
};
