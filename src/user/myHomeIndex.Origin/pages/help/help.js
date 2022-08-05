/**
 * @Desc
 * @author hufangqin
 * @date 2020/9/30
 * @version */
import React, { useEffect, useState } from 'react';
import './help.less';

export function Help (props) {
    const content = () => {
        return <div className="help-wrap">
            <p>家庭账户根据您办理过的群里类业务（如亲情网）创建，希望向您提供更优质的家庭服务。</p>
            <p className="help-title">家庭账户有什么用？</p>
            <p>基于家庭账户，您可以帮家人充话费、充流量，拨打电话，共享家庭权益。我们也会不定期推出免费家庭权益。</p>
            <p className="help-title">部分家庭成员我不认识？</p>
            <p>家庭账户根据您办理过的群组类业务创建，可能存在数据不准确的情况。您可以：</p>
            <p>1、（仅户主）在家庭管理中删除不认识的成员；</p>
            <p>2、（仅户主）添加真实的家庭成员；</p>
            <p>3、如果您不认识户主，可自行退出当前家庭。</p>
        </div>;
    };
    useEffect(() => {
        document.title = '家庭账户';
    }, []);
    return (
        content()
    );
}
