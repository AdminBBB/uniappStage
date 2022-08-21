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

const TABLE_OUTSIZE_HEIGHT = 206;
export function DataTable () {
    const { state, dispatch } = useContext(COMMON_CONTEXT);
    const navigate = useNavigate();
    const LcrMngOperaters = useLcrMngOperaters();
    const { LauncherData, LauncherDataTotal, LcrDependencesData, LcrTableLoading, LcrTablePageNo, LcrTablePageSize, localauthType } = state;
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
            title: '条目ID',
            dataIndex: 'itemId',
            fixed: 'left',
            width: 100
        },
        {
            title: '项目名称',
            dataIndex: 'itemName',
            defaultSortOrder: 'descend',
            width: 200
        },
        {
            title: '投放类型',
            dataIndex: 'itemType',
            width: 100,
            filters: [
                {
                    text: '产品',
                    value: 0
                },
                {
                    text: '运营',
                    value: 1
                }
            ],
            filterMultiple: false,
            render: (text, record, index) => <span>{ITEM_TYPE_TXT[record.itemType]}</span>
        }, {
            title: '项目部门',
            dataIndex: 'department',
            width: 125,
            filters: LcrDependencesData.depListFilter,
            filterMultiple: false
        },
        {
            title: '创建人/创建时间',
            dataIndex: ['createBy', 'createTime'],
            defaultSortOrder: 'descend',
            width: 125,
            render: (text, record, index) => (
                <span>{record.createBy}<br />{moment(record.createTime).format('YYYY/MM/DD HH:mm')}</span>
            )
        },
        {
            title: '区域',
            dataIndex: 'regionCode',
            width: 125,
            render: (regionCode, record, index) => {
                const regionNames = (regionCode || '').split(',').map(code => {
                    return LcrDependencesData?.regionsMap?.[code];
                }).join('，');
                return regionNames.length <= 18 ?
                    <span>{regionNames}</span> :
                    <Tooltip title={regionNames}>
                        {regionNames.substr(0, 18)}
                    </Tooltip>;
            }
        },
        {
            title: '系统',
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
                    text: '全部系统',
                    value: 3
                }
            ],
            filterMultiple: false,
            render: (text, record, index) => (
                <span>{SYSTEM_TYPE_TXT[record.system]}</span>
            )
        },
        {
            title: '版本',
            dataIndex: ['minVersion'],
            width: 90,
            filters: LcrDependencesData.versionListFilter,
            filterMultiple: false,
            render: (text, record, index) => (
                <span>最低:{record.minVersion}<br />最高:{record.maxVersion}</span>
            )
        },
        {
            title: '用户获取',
            dataIndex: 'tagType',
            width: 90,
            filters: [
                {
                    text: '自动',
                    value: '1'
                },
                {
                    text: '接口',
                    value: '3'
                },
                {
                    text: '名单',
                    value: '2'
                }
            ],
            filterMultiple: false,
            render: (text, record, index) => (
                <span>{TAG_TYEP_TEXT[record.tagType]}</span>
            )
        },
        {
            title: '资源总数',
            dataIndex: 'resourceCount',
            width: 80
        },
        {
            title: '最后编辑',
            dataIndex: ['updateBy', 'updateTime'],
            defaultSortOrder: 'descend',
            width: 135,
            render: (text, record, index) => (
                <span>{record.updateBy}<br />{moment(record.updateTime).format('YYYY/MM/DD HH:mm')}</span>
            )
        },
        {
            title: '预设上/下线时间',
            dataIndex: ['minPreTime'],
            width: 130,
            render: (text, record, index) => (
                <span>{moment(record.minPreTime).format('YYYY/MM/DD HH:mm')}<br />{moment(record.maxPreTime).format('YYYY/MM/DD HH:mm')}</span>
            ),
            filters: [
                {
                    text: '降序',
                    value: true
                },
                {
                    text: '升序',
                    value: false
                }
            ],
            filterMultiple: false
            //onFilter: (value, record) => record.address.indexOf(value) === 0,
        },
        {
            title: '实际生效/下线时间',
            dataIndex: ['minRealTime'],
            width: 145,
            render: (text, record, index) => {
                return record.minRealTime && record.minRealTime ? <span>{moment(record.minRealTime).format('YYYY/MM/DD HH:mm')}<br />{moment(record.maxRealTime).format('YYYY/MM/DD HH:mm')}</span> : '暂无';
            }
            ,
            filters: [
                {
                    text: '降序',
                    value: true
                },
                {
                    text: '升序',
                    value: false
                }
            ],
            filterMultiple: false
        },
        {
            title: '常规状态',
            dataIndex: 'itemStatus',
            width: 120,
            filters: [
                {
                    text: '已保存未提交',
                    value: 1
                },
                {
                    text: '已提交未确认',
                    value: 2
                },
                {
                    text: '已提交已驳回',
                    value: 3
                },
                {
                    text: '物料待提交',
                    value: 4
                },
                {
                    text: '已生效待上线',
                    value: 5
                },
                {
                    text: '已生效已上线',
                    value: 6
                },
                {
                    text: '已生效已下线',
                    value: 7
                },
                {
                    text: '已失效',
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
            title: '管理状态',
            dataIndex: 'address',
            width: 250,
            render: (text, record, index) => {
                return record.extraItemStatus && record.extraItemStatus !== 0 ?
                    <div className="c-review">
                        <p>视觉审核<br />{REVIEW_TXT[record.visualReview]}<br />(+{REVIEW_TXT[record.extraVisualReview]})</p>
                        <p>内容审核<br />{REVIEW_TXT[record.contentReview]}<br />(+{REVIEW_TXT[record.extraContentReview]})</p>
                        <p>超管审核<br />{REVIEW_TXT[record.superReview]}<br />(+{REVIEW_TXT[record.extraSuperReview]})</p>
                    </div> :
                    <div className="c-review">
                        <p>视觉审核<br />{REVIEW_TXT[record.visualReview]}</p>
                        <p>内容审核<br />{REVIEW_TXT[record.contentReview]}</p>
                        <p>超管审核<br />{REVIEW_TXT[record.superReview]}</p>
                    </div>;
            }
        },
        {
            title: '常规操作',
            dataIndex: 'itemId',
            width: 200,
            fixed: 'right',
            render: (itemId, record) => {
                // itemStatus :: 条目状态 :: 0,没有追加，1已保存，2已提交，3已驳回，4提交已确认(排期通过,物料待提交),5已生效待上线，6已生效已上线，7已生效已下线，8已失效
                // extraItemStatus :: 追加资源的条目状态 :: 0,没有追加，1已保存，2已提交，3已驳回，4提交已确认(排期通过,物料待提交),5已生效待上线，6已生效已上线，7已生效已下线，8已失效
                const { itemStatus, extraItemStatus } = record;
                const couldVieStyle = localauthType !== 99 ? '' : 'noactive'; // 查看
                const couldCopStyle = (localauthType !== 1 && localauthType !== 99) ? '' : 'noactive';  // 复制
                const couldEdiStyle = itemStatus !== 6 && extraItemStatus !== 6 && (([0, 2, 3, 4, 5].includes(localauthType) && (itemStatus === 1 || extraItemStatus === 1))  // 超管、产品2/运营3管理、产品4/运营5申请 只有在条目保存未提交，追着追加条目保存未提交的情况下才可以编辑
                    || ([0, 2, 3].includes(localauthType) && ([2, 5, 7].includes(itemStatus) || [2, 5, 7].includes(extraItemStatus)))) // 超管、产品2/运营3管理 在2已提交、5已生效待上线、7已生效已下线 情况下可以编辑
                    ? 'nor' : 'noactive';
                const couldAdtStyle = (localauthType !== 1 && localauthType !== 99 && [4, 5, 6, 7, 8].includes(itemStatus) && extraItemStatus === 0) ? 'nor' : 'noactive'; // extraItemStatus === 0 没有追加
                const couldArcStyle = localauthType !== 1 && localauthType !== 99 && (itemStatus === 4 || extraItemStatus === 4) ? 'nor' : 'noactive';
                const couldDelStyle = ([0, 2, 3, 4, 5].includes(localauthType) && (itemStatus === 1 || extraItemStatus === 1))
                || ([0, 2, 3].includes(localauthType) && (itemStatus === 4 || extraItemStatus === 4))
                || (localauthType === 0 && [3, 8].includes(itemStatus)) ? '' : 'noactive';
                const couldRelStyle = (([0, 2, 3, 4, 5].includes(localauthType) && itemStatus === 5)
                    || ([0, 2, 3].includes(localauthType) && itemStatus === 7)) ? '' : 'noactive';
                return <div className="c-status">
                    <a className={couldVieStyle} onClick={() => dispatch({ viewLauncherInModalByItemId: itemId, operateType: 20 })}>查看</a>
                    <a className={couldEdiStyle} onClick={() => navigate(`/editLauncher/${itemId}/10`)}>编辑</a>
                    <a className={couldCopStyle} onClick={() => navigate(`/editLauncher/${itemId}/11`)}>复制</a>
                    <a className={couldDelStyle} onClick={() => dispatch({ deleteModalItemId: itemId })}>删除</a>
                    <a className={couldAdtStyle} onClick={() => navigate(`/editLauncher/${itemId}/13`)}>追加</a>
                    <a className={couldArcStyle} onClick={() => navigate(`/editLauncher/${itemId}/14`)}>物料</a>
                    <a className={couldRelStyle} onClick={() => navigate(`/editLauncher/${itemId}/15`)}>更新</a>
                </div>;
            }
        },
        {
            title: '管理操作',
            dataIndex: 'itemId',
            fixed: 'right',
            width: 200,
            render: (itemId, record) => {
                const { itemStatus, extraItemStatus } = record;
                const couldOnLine = ([0, 2, 3].includes(localauthType) && ([7].includes(itemStatus) || [7].includes(extraItemStatus))) ? '' : 'noactive';
                const couldOffLine = ([0, 2, 3].includes(localauthType) && ([5, 6].includes(itemStatus) || [5, 6].includes(extraItemStatus))) ? '' : 'noactive';
                const couldReview = ([0, 1, 2, 3].includes(localauthType) && ([4].includes(itemStatus) || [4].includes(extraItemStatus))) ? '' : 'noactive';
                const couldViewLog = [0, 1, 2, 3].includes(localauthType) ? '' : 'noactive';
                const grayStatusSwitch = ([0, 2, 3].includes(localauthType) && ([5, 7].includes(itemStatus) || [5, 7].includes(extraItemStatus))) ? '' : 'noactive';
                return <div className="c-edit">
                    <div className="edit-l">
                        <a className={couldOnLine} onClick={async () => await LcrMngOperaters('switchOnline', record, 1)}>上线</a>
                        <a className={couldViewLog} onClick={() => navigate(`/viewLogs/${itemId}`)}>日志</a>
                        <a className={couldOffLine} onClick={async () => await LcrMngOperaters('switchOnline', record, 0)}>下线</a>
                        <a className={couldReview} onClick={() => navigate(`/editLauncher/${itemId}/31`)}>审核</a>
                    </div>
                    <div className="edit-r">
                        <a className={grayStatusSwitch} onClick={async () => await LcrMngOperaters('grayStatusEdit', record)}>
                            白名单测试状态： <span style={{ color: record.grayStatus === 0 ? '#1890ff' : 'red' }}>{GRAY_STATUS_TXT[record.grayStatus]}</span>
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
                   pagination={{ current: LcrTablePageNo, showQuickJumper: true, pageSizeOptions: TABLE_PAGESIZE_OPTION, position: ['bottomCenter'], showTotal: (t) => `共${t}条`, pageSize: LcrTablePageSize, total: LauncherDataTotal }} />
        </div>
    </div>;
}
