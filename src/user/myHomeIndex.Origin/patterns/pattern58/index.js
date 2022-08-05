// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from 'react';
import { MemberOpen } from './account/open';
import { MemberUnopen } from './account/unopen';
import { SERVICE_CONTEXT } from '../../api/reducer';
import {getFamilyGD} from "../../api/accountGD";
import {Auth} from '@hjq/uts';
import uniappbridge from "@hjq/uniappbridge";


export default function Pattern60 (props) {

    const { state: { familyGD }, dispatch } = useContext(SERVICE_CONTEXT);

    useEffect(()=>{
        requestData();
        uniappbridge.viewDidAppear(() => {
            requestData();
        }, (e) => {
        });
    }, []);

    const requestData = async ()=>{
        try {
            const res  = await getFamilyGD();
            console.log(res);
            res.memberList.forEach(ele=>{
                if (ele.houseHolder === 1 && Auth.mobile === ele.phone) {
                    res.isMaster = 1;
                }
            })
            dispatch({familyGD:res})
            // dispatch({
            //     familyGD:{
            //         "businessStatus": 1,
            //         "maxTotal": 19,
            //         "mealInfo": "5元/月",
            //         "memberList": [
            //             {
            //                 "phone": "13702607474",
            //                 "name": null,
            //                 "shortPhone": "551",
            //                 "province": "200",
            //                 "provinceText": null,
            //                 "region": "757",
            //                 "regionText": "佛山",
            //                 "houseHolder": 1,
            //                 "effectTime": "20200617164001",
            //                 "invalidTime": "20370101000000",
            //                 "status": 1
            //             },
            //             {
            //                 "phone": "14715004627",
            //                 "name": null,
            //                 "shortPhone": "552",
            //                 "province": "200",
            //                 "provinceText": null,
            //                 "region": "200",
            //                 "regionText": "广州",
            //                 "houseHolder": 0,
            //                 "effectTime": "20211115141549",
            //                 "invalidTime": "20370101000000",
            //                 "status": 1
            //             },
            //             {
            //                 "phone": "13802605893",
            //                 "name": null,
            //                 "shortPhone": "553",
            //                 "province": "200",
            //                 "provinceText": null,
            //                 "region": "750",
            //                 "regionText": "江门",
            //                 "houseHolder": 0,
            //                 "effectTime": "20211115141200",
            //                 "invalidTime": "20370101000000",
            //                 "status": 1
            //             },
            //             {
            //                 "phone": "13600322307",
            //                 "name": null,
            //                 "shortPhone": "554",
            //                 "province": "200",
            //                 "provinceText": null,
            //                 "region": "757",
            //                 "regionText": "佛山",
            //                 "houseHolder": 0,
            //                 "effectTime": "20200629172822",
            //                 "invalidTime": "20370101000000",
            //                 "status": 1
            //             },
            //             {
            //                 "phone": "13802610460",
            //                 "name": null,
            //                 "shortPhone": "555",
            //                 "province": "200",
            //                 "provinceText": null,
            //                 "region": "750",
            //                 "regionText": "江门",
            //                 "houseHolder": 0,
            //                 "effectTime": "20211115141701",
            //                 "invalidTime": "20370101000000",
            //                 "status": 1
            //             },
            //             {
            //                 "phone": "14778320022",
            //                 "name": null,
            //                 "shortPhone": "557",
            //                 "province": "200",
            //                 "provinceText": null,
            //                 "region": "200",
            //                 "regionText": "广州",
            //                 "houseHolder": 0,
            //                 "effectTime": "20211115145858",
            //                 "invalidTime": "20370101000000",
            //                 "status": 1
            //             }
            //         ],
            //         "channelUrl": "https://base.hjq.komect.com/digitalhome/familyPays/pages/homeNet/index.html?jsessionId=${JSESSIONID}&passId=${passId}",
            //         "needPayBtn": false,
            //         "familyGroupH5Url": "",
            //         "isEncry": true
            //     }
            // })
        } catch (e) {

        }

    }

    return (
        <div className='p58-wrap'>
            {
                familyGD.businessStatus === 0 ? <MemberUnopen familyData={familyGD} titleData={props.data.title}  content={props.data.content}/> :
                    ( familyGD.businessStatus === 1 ? <MemberOpen familyData={familyGD} titleData={props.data.title}  content={props.data.content}/> : null)
            }
        </div>
    );
};
