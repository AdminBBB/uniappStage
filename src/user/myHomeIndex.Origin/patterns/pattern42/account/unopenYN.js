/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */
import React, { useState } from 'react';
import { Grid } from 'antd-mobile';
import '../less/members.less';
import {openH5UrlV2} from  '@hjq/openHjqUrl';
import dataG from '../../../api/data';

export function MemberUnopenYN () {
    const [dataList] = useState([
        { title: '宽带上网', detail: '最高至千兆', img: require('../assets/unopenYN/hardware_gateway_icon_kuandaishangwang@2x.png') },
        { title: '400G云盘', detail: '家庭云盘空间', img: require('../assets/unopenYN/shop_icon_hcy@3x.png') },
        { title: '高清收视', detail: '追剧学习问诊', img: require('../assets/unopenYN/shop_icon_gaoqingdianshi@3x.png') },
        { title: 'WiFi调测', detail: '信号全家覆盖', img: require('../assets/unopenYN/shop_icon_wifi@2x.png') },
    ]);

    const clickOrder = () => {
        openH5UrlV2({ web: dataG.ynData.unopenFamily }, { bridgeOpen: true, noArea: true });
    };

    return (
        <div className="members-unopen-wrap-42">
            <div className='text1'><span>家庭账号</span>
            </div>
            <div className='text2'>开通家庭账号可领取以下权益</div>
            <Grid data={dataList}
                  className='gridWrap'
                  columnNum={4}
                  hasLine={false}
                  square={false}
                  activeStyle={false}
                  itemStyle={{ height: '85px' }}
                  renderItem={dataItem => (
                      <div className={`gridView ${dataItem.title === '家长伴学' || dataItem.title === '同享会员' ? 'pop' : '' }`}>
                          <img src={dataItem.img} className='img1' />
                          <div className='t1'>
                              <span>{dataItem.title}</span>
                          </div>
                          <div className='t2'>
                              <span>{dataItem.detail}</span>
                          </div>
                      </div>
                  )}
            />
            <div className='m-btn' onClick={clickOrder}>去办理</div>
        </div>
    );
}
