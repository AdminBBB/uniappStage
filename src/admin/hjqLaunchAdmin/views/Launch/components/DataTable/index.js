/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/9.
 * Copyright 2021/11/9 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/9
 * @version */
import './style.less';
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Table, Tooltip } from 'antd';
import { COMMON_CONTEXT } from '../../../../store';
import { ITEM_STATUS_TXT, ITEM_TYPE_TXT, SYSTEM_TYPE_TXT, TAG_TYEP_TEXT, REVIEW_TXT, GRAY_STATUS_TXT, TABLE_PAGESIZE_OPTION } from '../../../../common/CONSTANT';
import { getFirstItem, deleteObjNull } from '../../../../service/utils';
import { useLcrMngOperaters } from '../../../../Controllers/useLcrMngOperaters';
import { useCheckAuthRight } from '../../../../Controllers/useCheckAuthRight';

const TABLE_OUTSIZE_HEIGHT = 206;
export function DataTable () {
    const { state, dispatch } = useContext(COMMON_CONTEXT);
    const navigate = useNavigate();
    const LcrMngOperaters = useLcrMngOperaters();
    const { checkRight } = useCheckAuthRight();
    const { LauncherData, LauncherDataTotal, LcrDependencesData, LcrTableLoading, LcrTablePageNo, LcrTablePageSize } = state;
    const [tablescroll, setTableScroll] = useState(document.documentElement.offsetHeight - TABLE_OUTSIZE_HEIGHT);
    const onChange = async (pagination, filters) => {
        const { current: page, pageSize: size } = pagination;
        let tOptions = {
            itemType: getFirstItem(filters.itemType, null),
            department: getFirstItem(filters.department),
            system: getFirstItem(filters.system),
            version: getFirstItem(filters.minVersion),
            tagType: getFirstItem(filters.tagType),
            itemStatus: getFirstItem(filters.itemStatus),
            orderMinPreDesc: getFirstItem(filters.minPreTime),
            orderMinRealDesc: getFirstItem(filters.minRealTime)
        };
        await LcrMngOperaters('getLauncherMagList', Object.assign({ page, size }, deleteObjNull(tOptions)));
    };
    const columns = [
        {
            title: '??????ID',
            dataIndex: 'itemId',
            fixed: 'left',
            width: 100
        },
        {
            title: '????????????',
            dataIndex: 'itemName',
            defaultSortOrder: 'descend',
            width: 200
        },
        {
            title: '????????????',
            dataIndex: 'itemType',
            width: 100,
            filters: checkRight([1], 10) && [
                {
                    text: '??????',
                    value: 0
                },
                {
                    text: '??????',
                    value: 1
                }
            ],
            filterMultiple: false,
            render: (text, record, index) => <span>{ITEM_TYPE_TXT[record.itemType]}</span>
        }, {
            title: '????????????',
            dataIndex: 'department',
            width: 125,
            filters: LcrDependencesData.depListFilter,
            filterMultiple: false
        },
        {
            title: '?????????/????????????',
            dataIndex: ['createBy', 'createTime'],
            defaultSortOrder: 'descend',
            width: 125,
            render: (text, record, index) => (
                <span>{record.createBy}<br />{moment(record.createTime).format('YYYY/MM/DD HH:mm')}</span>
            )
        },
        {
            title: '??????',
            dataIndex: 'regionCode',
            width: 125,
            render: (regionCode, record, index) => {
                const regionNames = (((regionCode || '').split(',')).map(code => {
                    return LcrDependencesData?.regionsMap?.[code];
                })).join('???');
                return regionNames.length <= 16 ?
                    <span>{regionNames}</span> :
                    <Tooltip title={regionNames}>
                        {regionNames.substr(0, 16) + '......'}
                    </Tooltip>;
            }
        },
        {
            title: '??????',
            dataIndex: 'system',
            width: 80,
            filters: [
                {
                    text: 'IOS',
                    value: 1
                },
                {
                    text: 'Android',
                    value: 2
                },
                {
                    text: '????????????',
                    value: 3
                }
            ],
            filterMultiple: false,
            render: (text, record, index) => (
                <span>{SYSTEM_TYPE_TXT[record.system]}</span>
            )
        },
        {
            title: '??????',
            dataIndex: ['minVersion'],
            width: 90,
            filters: LcrDependencesData.versionListFilter,
            filterMultiple: false,
            render: (text, record, index) => (
                <span>??????:{record.minVersion}<br />??????:{record.maxVersion}</span>
            )
        },
        {
            title: '????????????',
            dataIndex: 'tagType',
            width: 90,
            filters: [
                {
                    text: '??????',
                    value: '1'
                },
                {
                    text: '??????',
                    value: '3'
                },
                {
                    text: '??????',
                    value: '2'
                },
                {
                    text: 'IOP',
                    value: '6'
                }
            ],
            filterMultiple: false,
            render: (text, record, index) => (
                <span>{TAG_TYEP_TEXT[record.tagType]}</span>
            )
        },
        {
            title: '????????????',
            dataIndex: 'resourceCount',
            width: 80
        },
        {
            title: '????????????',
            dataIndex: ['updateBy', 'updateTime'],
            defaultSortOrder: 'descend',
            width: 135,
            render: (text, record, index) => (
                <span>{record.updateBy}<br />{moment(record.updateTime).format('YYYY/MM/DD HH:mm')}</span>
            )
        },
        {
            title: '?????????/????????????',
            dataIndex: ['minPreTime'],
            width: 130,
            render: (text, record, index) => (
                <span>{moment(record.minPreTime).format('YYYY/MM/DD HH:mm')}<br />{moment(record.maxPreTime).format('YYYY/MM/DD HH:mm')}</span>
            ),
            filters: [
                {
                    text: '??????',
                    value: true
                },
                {
                    text: '??????',
                    value: false
                }
            ],
            filterMultiple: false
            //onFilter: (value, record) => record.address.indexOf(value) === 0,
        },
        {
            title: '????????????/????????????',
            dataIndex: ['minRealTime'],
            width: 145,
            render: (text, record, index) => {
                return record.minRealTime && record.minRealTime ? <span>{moment(record.minRealTime).format('YYYY/MM/DD HH:mm')}<br />{moment(record.maxRealTime).format('YYYY/MM/DD HH:mm')}</span> : '??????';
            }
            ,
            filters: [
                {
                    text: '??????',
                    value: true
                },
                {
                    text: '??????',
                    value: false
                }
            ],
            filterMultiple: false
        },
        {
            title: '????????????',
            dataIndex: 'itemStatus',
            width: 120,
            filters: [
                {
                    text: '??????????????????',
                    value: 1
                },
                {
                    text: '??????????????????',
                    value: 2
                },
                {
                    text: '??????????????????',
                    value: 3
                },
                {
                    text: '???????????????',
                    value: 4
                },
                {
                    text: '??????????????????',
                    value: 5
                },
                {
                    text: '??????????????????',
                    value: 6
                },
                {
                    text: '??????????????????',
                    value: 7
                },
                {
                    text: '?????????',
                    value: 8
                }
            ],
            filterMultiple: false,
            defaultSortOrder: 'descend',
            render: (text, record, index) => {
                return record.extraItemStatus && record.extraItemStatus !== 0 ?
                    <span> {ITEM_STATUS_TXT[record.itemStatus]}(+{ITEM_STATUS_TXT[record.extraItemStatus]})</span> :
                    <span> {ITEM_STATUS_TXT[record.itemStatus]}</span>;
            }
        },
        {
            title: '????????????',
            dataIndex: 'address',
            width: 250,
            render: (text, record, index) => {
                return record.extraItemStatus && record.extraItemStatus !== 0 ?
                    <div className="c-review">
                        <p>????????????<br />{REVIEW_TXT[record.visualReview]}<br />(+{REVIEW_TXT[record.extraVisualReview]})</p>
                        <p>????????????<br />{REVIEW_TXT[record.contentReview]}<br />(+{REVIEW_TXT[record.extraContentReview]})</p>
                        <p>????????????<br />{REVIEW_TXT[record.superReview]}<br />(+{REVIEW_TXT[record.extraSuperReview]})</p>
                    </div> :
                    <div className="c-review">
                        <p>????????????<br />{REVIEW_TXT[record.visualReview]}</p>
                        <p>????????????<br />{REVIEW_TXT[record.contentReview]}</p>
                        <p>????????????<br />{REVIEW_TXT[record.superReview]}</p>
                    </div>;
            }
        },
        {
            title: '????????????',
            dataIndex: 'itemId',
            width: 200,
            fixed: 'right',
            render: (itemId, record) => {
                // itemStatus :: ???????????? :: 0,???????????????1????????????2????????????3????????????4???????????????(????????????,???????????????),5?????????????????????6?????????????????????7?????????????????????8?????????
                // extraItemStatus :: ??????????????????????????? :: 0,???????????????1????????????2????????????3????????????4???????????????(????????????,???????????????),5?????????????????????6?????????????????????7?????????????????????8?????????
                const { itemStatus, itemType, extraItemStatus, createBy } = record;
                // const couldViewStyle = checkCreateBy(createBy, ['admin', 'ui']) ? 'nor' : 'noactive';
                const couldViewStyle = 'nor';
                // const couldCopyStyle = checkRight([],2345]) ? 'nor' : 'noactive';
                const couldCopyStyle = checkRight([2, 3, 4, 5]) ? 'nor' : 'noactive';
                const couldEditStyle = (
                    // ???????????????2/??????3???????????????4/??????5?????? ?????????????????????????????????????????????????????????????????????????????????????????????
                    (itemStatus !== 6 && extraItemStatus !== 6 && ((checkRight([], itemType, createBy) && (itemStatus === 1 || extraItemStatus === 1)))) ||
                    // ???????????????2/??????3?????? ???2????????????5?????????????????????7?????????????????? ?????????????????????
                    (checkRight([], itemType) && ([2, 5, 7].includes(itemStatus) || [2, 5, 7].includes(extraItemStatus)))
                ) ? 'nor' : 'noactive';
                const couldAdtStyle = (checkRight([], itemType, createBy) && [4, 5, 6, 7, 8].includes(itemStatus) && extraItemStatus === 0) ? 'nor' : 'noactive'; // extraItemStatus === 0 ????????????
                const couldArcStyle = (checkRight([], itemType, createBy) && (itemStatus === 4 || extraItemStatus === 4)) ? 'nor' : 'noactive';
                const couldDeltStyle = ((checkRight([], itemType, createBy) && (itemStatus === 1 || extraItemStatus === 1))
                    || (checkRight([], itemType) && (itemStatus === 4 || extraItemStatus === 4))
                    || (checkRight() && [3, 8].includes(itemStatus))) ? '' : 'noactive';
                const couldRelStyle = ((checkRight([], itemType, createBy) && itemStatus === 5)
                    || (checkRight([], itemType) && itemStatus === 7)) ? '' : 'noactive';
                return <div className="c-status">
                    <a className={couldViewStyle} onClick={() => dispatch({ viewLauncherInModalByItemId: itemId, operateType: 20 })}>??????</a>
                    <a className={couldEditStyle} onClick={() => navigate(`/editLauncher/${itemId}/10`)}>??????</a>
                    <a className={couldCopyStyle} onClick={() => navigate(`/editLauncher/${itemId}/11`)}>??????</a>
                    <a className={couldDeltStyle} onClick={() => dispatch({ deleteModalItemId: itemId })}>??????</a>
                    <a className={couldAdtStyle} onClick={() => navigate(`/editLauncher/${itemId}/13`)}>??????</a>
                    <a className={couldArcStyle} onClick={() => navigate(`/editLauncher/${itemId}/14`)}>??????</a>
                    <a className={couldRelStyle} onClick={() => navigate(`/editLauncher/${itemId}/15`)}>??????</a>
                </div>;
            }
        },
        {
            title: '????????????',
            dataIndex: 'itemId',
            fixed: 'right',
            width: 200,
            render: (itemId, record) => {
                const { itemStatus, itemType, extraItemStatus, createBy } = record;
                const couldOnLine = checkRight([], itemType) && ([7].includes(itemStatus) || [7].includes(extraItemStatus)) ? 'nor' : 'noactive';
                const couldOffLine = checkRight([], itemType) && ([5, 6].includes(itemStatus) || [5, 6].includes(extraItemStatus)) ? 'nor' : 'noactive';
                const couldViewLog = checkRight([1], itemType) ? 'nor' : 'noactive';
                const couldReview = checkRight([1], itemType) && ([4].includes(itemStatus) || [4].includes(extraItemStatus)) ? 'nor' : 'noactive';
                const grayStatusSwitch = checkRight([], itemType) && ([5, 7].includes(itemStatus) || [5, 7].includes(extraItemStatus)) ? 'nor' : 'noactive';
                return <div className="c-edit">
                    <div className="edit-l">
                        <a className={couldOnLine} onClick={async () => await LcrMngOperaters('switchOnline', record, 1)}>??????</a>
                        <a className={couldViewLog} onClick={() => navigate(`/viewLogs/${itemId}`)}>??????</a>
                        <a className={couldOffLine} onClick={async () => await LcrMngOperaters('switchOnline', record, 0)}>??????</a>
                        <a className={couldReview} onClick={() => navigate(`/editLauncher/${itemId}/31`)}>??????</a>
                    </div>
                    <div className="edit-r">
                        <a className={grayStatusSwitch} onClick={async () => await LcrMngOperaters('grayStatusEdit', record)}>
                            ???????????????????????? <span style={{ color: record.grayStatus === 0 ? '#1890ff' : 'red' }}>{GRAY_STATUS_TXT[record.grayStatus]}</span>
                        </a>
                    </div>
                </div>;
            }
        }
    ];
    useEffect(() => {
        (async () => {
            await LcrMngOperaters('getLauncherMagList');
        })();
        window.addEventListener('resize', () => {
            setTableScroll(document.documentElement.offsetHeight - TABLE_OUTSIZE_HEIGHT);
        }, false);
    }, []);
    return <div className="g-table">
        <div className={'table-content'}>
            <Table size={'small'}
                   loading={LcrTableLoading}
                   bordered
                   columns={columns}
                   dataSource={LauncherData}
                   onChange={onChange}
                   rowKey={columns => columns.id}
                   scroll={{ y: tablescroll }}
                   pagination={{ current: LcrTablePageNo, showQuickJumper: true, pageSizeOptions: TABLE_PAGESIZE_OPTION, position: ['bottomCenter'], showTotal: (t) => `???${t}???`, pageSize: LcrTablePageSize, total: LauncherDataTotal }} />
        </div>
    </div>;
}
