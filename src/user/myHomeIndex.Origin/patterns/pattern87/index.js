import React, { useEffect, useContext, useState } from 'react';
import { SERVICE_CONTEXT } from '../../api/reducer';
import Tr from '@hjq/trace';
import './index.less';
import vData, { dateTimeCompare } from './assets/configData';
import { openUrl, getCloudParams } from './assets/uts';
import { getFamilyViewData } from '../../api/familyView';
// import uniAppbridge from '@hjq/uniappbridge';

export default function Pattern87(props) {
    const { state } = useContext(SERVICE_CONTEXT);
    const { USER_INFO: { provCode } } = state;
    const [familyViewList, setFamilyViewList] = useState([]);
    const [familyDefaultList, setFamilyDefaultList] = useState([]);
    const [familyConfigData, setFamilyConfigData] = useState([]);
    const [memberList, setMemberList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    useEffect(() => {
        getData();
        getCloudParams();
    }, []);
    const getData = async () => {
        try {
            const res = await getFamilyViewData();
            setFamilyViewList(res[0] || []);
            setFamilyDefaultList(res[1] || []);
            setFamilyConfigData(res[2] || []);
            if (res) {
                initData(res[0], res[1], res[2]);
            }
        } catch (e) {
        }
    };
    const initData = (family, familyDefault, familyConfig) => {
        let businessType = null;
        // 广东广东
        /* if (+provCode !== 50) {
             businessType = vData.businessType;
         } else {
             businessType = Object.assign({ tv: 9 }, vData.businessType);
         }*/
        businessType = vData.businessType;
        // 订购的业务卡片+推荐卡片最多展示familyDefault?.config?.cardNum 个处理
        let _member = [], _state = [];
        const cardNum = familyDefault?.config?.cardNum || 4;
        Object.keys(businessType).map((statusKey) => {
            if (_member.length >= cardNum) {
                return true;
            }
            let _findMember = family.filter((member) => {
                return member.businessType === businessType[statusKey];
            });
            let _findConfig = familyConfig.find((config) => {
                return config.businessType === businessType[statusKey];
            });
            if (_findMember && _findMember.length) {
                _findMember = _findMember.splice(0, cardNum - _member.length);
                _member = _member.concat(_findMember);
            } else if (_findConfig.visible === '1' && familyDefault[statusKey] && !familyDefault[statusKey].hideCard) {
                if (_findConfig?.recommendCard?.orderUrl) {
                    familyDefault[statusKey].link = _findConfig?.recommendCard?.orderUrl;
                }
                _state.push(familyDefault[statusKey]);
            }
        });
        // 到期时间特殊处理
        _member.map((mem) => {
            let _d = '';
            if (mem.continus) {
                mem['continusDesc'] = '连续包月';
            } else {
                _d = dateTimeCompare(mem.endTime || '', 5);
                mem['continusDesc'] = _d ? `${_d}天后到期` : mem.endTime ? `${mem.endTime}到期` : '已办理';
            }
        });
        _state = _state.splice(0, cardNum - _member.length);
        setMemberList(_member);
        setStatusList(_state);
    };
    const memberClick = (member, e) => {
        let _url = '';
        if (e.target.nodeName.toLowerCase() === 'a') {
            // 按钮跳转
            _url = member?.buttonUrl || '';
            Tr.et('familyViewHome_gotoButton', {
                businessType: member.businessType,
                cardName: member.cardName,
                buttonText: member.buttonText,
                actionUrl: encodeURIComponent(member.redirectUrl || ''),
                buttonUrl: encodeURIComponent(member.buttonUrl || '')
            });
        } else {
            // 详情跳转
            Tr.et('familyViewHome_gotoAction', {
                businessType: member.businessType,
                cardName: member.cardName,
                buttonText: member.buttonText,
                actionUrl: encodeURIComponent(member.redirectUrl || ''),
                buttonUrl: encodeURIComponent(member.buttonUrl || '')
            });
            _url = member?.redirectUrl || '';
        }
        _url && openUrl(_url);
    };
    const defaultClick = (def) => {
        Tr.et('familyViewHome_gotoDefault', {
            businessType: def.businessType,
            cardName: def.title,
            actionUrl: encodeURIComponent(def.link)
        });
        def.link && openUrl(def.link);
    };
    const moreClick = () => {
        const moreUrl = familyDefaultList?.config?.moreUrl || '';
        Tr.et('familyViewHome_gotoMore', {
            cardName: '查看更多',
            actionUrl: encodeURIComponent(moreUrl)
        });
        moreUrl && openUrl(moreUrl);
    };
    return (
        <div>
            {memberList.length || statusList.length ? (
                <div className="Pattern87-wrap">
                    <ul className="ul-state">
                        {memberList && memberList.map((mem) => {
                            return (
                                <li key={`${mem.businessType}mem`}
                                    className={`li-${vData.DefaultCodeDict[mem.businessType]} m-li-${vData.DefaultCodeDict[mem.businessType]}`}
                                    onClick={(e) => {
                                        memberClick(mem, e);
                                    }}
                                >
                                    <div className={`m-top ${mem.superMember ? 'm-top-tvs' : ''} ${!mem.continusDesc || !mem.cardName ? 'm-top-text' : ''}`}
                                        aria-label={`${mem.cardName || '业务'} ${mem.continusDesc} `}
                                        role={'button'}
                                    >
                                        <img alt={mem.cardName || '业务'}
                                            aria-hidden="true"
                                            src={mem.superMember ? familyDefaultList[vData.DefaultCodeDict[mem.businessType]].titleIconSuper : familyDefaultList[vData.DefaultCodeDict[mem.businessType]]?.titleIcon} />
                                        <div className="m-text">
                                            <p className="m-text-p1">{mem.cardName || ''}</p>
                                            <p className="m-text-p2">{mem.continusDesc || ''}</p>
                                        </div>
                                    </div>
                                    <div className="m-content"
                                        aria-label={`${mem.cardName || '业务'}`}
                                        role={'button'}
                                    >
                                        {
                                            mem.packageInfo && mem.packageInfo.map((pac, i) => {
                                                return <div className="m-content-package" key={i}>
                                                    <p>{pac.unit ? `${pac.count}${pac.unit}` : pac.count}</p>
                                                    <p className={pac.desc && pac.desc.length ? 'm-content-package-ellip' : ''}>{pac.desc}</p>
                                                </div>;
                                            })
                                        }
                                    </div>
                                    <a role={'button'} aria-label={`${mem.cardName || '业务'}${mem.buttonText}`}>{mem.buttonText}</a>
                                </li>
                            );
                        })}
                        {statusList && statusList.map((status) => {
                            return (
                                <li key={`${status.businessType}status`}
                                    className={`status-li li-${vData.DefaultCodeDict[status.businessType]} `}
                                    aria-label={`${status.title || '业务'}${status?.descTitle} ${status.desc}`}
                                    role={'button'}
                                    onClick={() => {
                                        defaultClick(status);
                                    }}
                                >
                                    <div className="m-top">
                                        <img alt={status.title || '业务'} src={status?.titleIcon} aria-hidden="true" />
                                        <div className="m-text">
                                            <p>{status.title}</p>
                                        </div>
                                    </div>
                                    <div className="m-content">
                                        <div className="m-content-package">
                                            <p>{status.descTitle}</p>
                                            <p>{status.desc}</p>
                                        </div>
                                    </div>
                                    <a aria-hidden="true">{status.buttonText}</a>
                                </li>
                            );
                        })}
                        <li className="li-more">
                            <div className="li-more-unit" onClick={() => {
                                moreClick();
                            }} role={'button'}>
                                <p >查看更多</p>
                                <div className="li-more-icon" aria-hidden="true"></div>
                            </div>

                        </li>
                    </ul>
                </div>
            ) : ''}
        </div>
    );
}

