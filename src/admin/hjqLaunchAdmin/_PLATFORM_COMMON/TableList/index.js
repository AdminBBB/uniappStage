/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/7/16.
 * Copyright 2021/7/16 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/7/16
 * @version */
import './style.less';
import React from 'react';

export function TableList (props) {
    const { thead, tableClass = '', children, tbodyHeight = 'auto' } = props;
    return <div className={`g-tableList ${tableClass}`}>
        <div className={'tableThead'}>
            <table>
                <thead>
                    <tr>
                        {thead.map((t, index) => {
                            return <td key={index}
                                       width={+t.w !== 0 ? t.w : 'auto'}>{t.n}</td>;
                        })}
                    </tr>
                </thead>
            </table>
        </div>
        <div className={'tableBody'} style={{ height: tbodyHeight }}>
            <table>
                <thead>
                    <tr>
                        {thead.map((t, index) => {
                            return <td key={index} width={+t.w !== 0 ? t.w : 'auto'} />;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {children.length > 0 ?
                        children :
                        <tr>
                            <td colSpan={thead.length}>无法查询到数据</td>
                        </tr>}
                </tbody>
            </table>
        </div>
    </div>;
}
