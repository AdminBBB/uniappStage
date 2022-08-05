/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */
import React, { useContext, useState, useEffect } from 'react';
import { Modal, Toast, Grid } from 'antd-mobile';
import uniappBridge from '@hjq/uniappbridge';
import Tr from '@hjq/trace';
import '../less/members.less';
import { getFamilyAccount, orderCX } from '../../../api/account';
import { compareVersion } from '@hjq/uts';
import {openH5UrlV2} from  '@hjq/openHjqUrl';

import dataG from '../../../api/data';
import { SERVICE_CONTEXT } from '../../../api/reducer.js';
import myToast from "../../../pages/manage/components/myToast";

export function MemberUnopen () {
    const { state: { familyData }, dispatch } = useContext(SERVICE_CONTEXT);
    const [dataList] = useState([
        { title: '免费通话', detail: '音视频通话', img: require('../assets/unopen/hardware_gateway_icon_mianfeitonghua@2x.png') },
        // { title: '40G云盘', detail: '家庭云盘空间', img: require('../assets/unopen/shop_icon_yunpan@2x.png') },
        { title: '同享会员', detail: '好礼送不停', img: require('../assets/unopen/shop_icon_tongxianghuiyuan@3x.png') },
        { title: '商城优惠券', detail: '智能设备优惠', img: require('../assets/unopen/shop_icon_shangcheng@2x.png') },
        { title: '家长伴学', detail: '首月免费试用', img: require('../assets/unopen/shop_icon_mianfeikecheng@2x.png') },
        { title: '话费代充', detail: '为家人充话费', img: require('../assets/unopen/icon_qmd@2x.png') },
        { title: '流量代充', detail: '为家人充流量', img: require('../assets/unopen/shop_icon_liuliang@2x.png') },
        { title: '权益共享', detail: '一人买多人享', img: require('../assets/unopen/shop_icon_quanyi@2x.png') },
        { title: '更多权益', detail: '等您探索', img: require('../assets/unopen/hardware_gateway_icon_gengduo@2x.png') }
    ]);
    const goLink = (ele) => {
        console.log('go link: ' + ele.actionUrl);
        if (!ele.actionUrl) {
            return;
        }
        Tr.et('main_click_unopenBanner'); // myHomeIndex_main_click_unopenBanner
        uniappBridge.openUrl(ele.actionUrl).then().catch(() => {
            location.href = ele.actionUrl;
        });
    };
    const clickHelp = () => {
        Tr.et('main_click_help', { status: 0 }); // myHomeIndex_main_click_help status: 0
        openH5UrlV2({ web: dataG.helpUrl }, { bridgeOpen: true, noArea: true });
    };
    const clickOrder = () => {
        Tr.et('main_click_goOrder'); // myHomeIndex_main_click_goOrder
        uniappBridge.getInfo('appVersion').then(appVersion => {
            console.log(appVersion);
            if (compareVersion(appVersion, '4.9.24', true)) {
                console.log('version bigger');
                uniappBridge.callHandler('showConfirmDlg', {
                    'title': '开通家庭账号',
                    subTitle: '您即将开通家庭账号，是否确认',
                    cancelBtnStr: '取消',
                    okBtnStr: '确认开通'
                }).then((res) => {
                    console.log('dlg then callback: ' + res);
                    if (res == 1) {
                        popSure();
                    }
                }).catch(() => {
                    nativePop();
                });
            } else {
                nativePop();
            }
        }).catch((e) => {
            console.log('version fail: ' + JSON.stringify(e));
            nativePop();
        });
    };
    const nativePop = () => {
        Modal.alert('开通家庭账号', '您即将开通家庭账号，是否确认', [
            {
                text: '取消',
                onPress: () => console.log('cancel'), style: 'default'
            },
            {
                text: '确认开通',
                onPress: () => {
                    popSure();
                }
            }
        ]);
    };
    const popSure = () => {
        Tr.et('main_click_orderSure'); // myHomeIndex_main_click_orderSure
        Toast.loading('', 0);
        orderCX().then(() => {
            getFamilyAccount().then(familyData => {
                Toast.hide();
                myToast.success('开通成功');
                dispatch({
                    familyData
                });
                Tr.et('main_click_orderSuccess'); // myHomeIndex_main_click_orderSuccess
            }).catch(e=>{
                Toast.hide();
            });
        }).catch(e => {
            Toast.hide();
            myToast.fail(e.message || '开通失败，请稍后重试');
        });
    };
    return (
        <div className="members-unopen-wrap">
            <div className='text1'><span>家庭账号</span>
                <div className='help-icon' onClick={clickHelp} role={'button'} aria-label='帮助'/>
            </div>
            <div className='text2'>开通家庭账号可领取以下权益</div>
            <div className='unopen-img-wrap'>
              <img src='https://rescdn.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_unopen_qg.png?v=2'/>
            </div>
            {/* <Grid data={dataList}
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
            /> */}
            <div className='m-btn' onClick={clickOrder}>免费开通</div>
        </div>
    );
}
