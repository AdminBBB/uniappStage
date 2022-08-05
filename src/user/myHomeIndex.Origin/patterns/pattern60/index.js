// eslint-disable-next-line no-unused-vars
import React, {useContext, useEffect, useReducer} from 'react';
import { MemberOpen } from './account/open';
import { MemberUnopen } from './account/unopen';
import { SERVICE_CONTEXT } from '../../api/reducer';
import {getFamilyAccount, getFDataSession, setFDataSession} from "../../api/account";
import uniappBridge from "@hjq/uniappbridge";


const MF_MAP = {
    0: MemberUnopen,
    2: MemberOpen
};
export default function Pattern60 (props) {
    const { state, dispatch } = useContext(SERVICE_CONTEXT);
    useEffect(() => {
        // 缓存先显示
        const fdata = getFDataSession();
        if (fdata) {
            dispatch({
                familyData: fdata
            });
        }
        // 更新数据
        refresh();
        uniappBridge.viewDidAppear(() => {
            // native切换时更新数据
            refresh();
        });
    }, []);
    const refresh = async () => {
        try {
            const res = await getFamilyAccount();
            dispatch({
                familyData: res
            });
            setFDataSession(res);
        } catch (e) {
        }
    };
    return (
        <div className={[`p60-wrap ${state.familyData.familyStatus === 2 ? 'backView' : ''}`]}>
            {
                state.familyData.familyStatus === 0 ? <MemberUnopen familyData={state.familyData} titleData={props.data.title} /> :
                    ( state.familyData.familyStatus === 2 ? <MemberOpen familyData={state.familyData} titleData={props.data.title}/> : null)
            }
        </div>
    );
};
