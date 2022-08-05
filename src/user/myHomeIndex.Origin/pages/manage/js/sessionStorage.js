import uniappbridge from "@hjq/uniappbridge";

/**
 * @Desc
 * @author hufangqin
 * @date 2021/2/3
 * @version */

export function setChoosedMember (obj) {
    window.sessionStorage.setItem('myHomeChoosedMember',JSON.stringify(obj));
}

export function getChoosedMember () {
    const obj =  window.sessionStorage.getItem('myHomeChoosedMember');
    return  obj ? JSON.parse(obj) : ''  ;
}

export function getContacts() {
    return new Promise((resolve , reject) =>{
        uniappbridge.getInfo('phoneAddressBookAuthority').then(authres => {
            if (authres == 1) {
                uniappbridge.callHandler('getContacts', '').then((responseData) => {
                    try {
                        const list = responseData ? JSON.parse(responseData) : [];
                        resolve(list);
                    } catch (e) {
                        resolve(-1);
                    }
                }).catch((e) => {
                    resolve(-1);
                });
            } else {
                resolve(-2);
            }
        }).catch((e) => {
            resolve(-1);
        });
    });
}
