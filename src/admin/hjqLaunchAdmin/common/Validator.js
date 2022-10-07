import { regex } from '@hjq/uts';

let validator = {
    contactName: (rule, value, callback) => {
        let reg = /^[A-Za-z0-9\u4E00-\u9FA5\（\）\(\)\-\_]{2,50}$/;
        if (value && !reg.test(value)) {
            callback('请输入正确的姓名');
        } else {
            callback();
        }
    },
    orgName: (rule, value, callback) => {
        let reg = /^[A-Za-z0-9\u4E00-\u9FA5\（\）\(\)\-\_]{2,50}$/;
        if (value && !reg.test(value)) {
            callback('请输入正确的组织名称');
        } else {
            callback();
        }
    },
    phoneNum: (rule, value, callback) => {
        if (value && !regex.reg.cellphone.test(value)) {
            callback('请输入正确手机号');
        } else {
            callback();
        }
    },
    isChinese: (rule, value, callback) => {
        let reg = /^[\u4e00-\u9fa5]+$/i;
        if (value && !reg.test(value)) {
            callback('请输入中文');
        } else {
            callback();
        }
    },
    isVersion: (rule, value, callback) => {
        let reg = /^[0-9]{1,2}\.[0-9]{1,3}\.[0-9]{1,4}$/;
        if (value && !reg.test(value)) {
            callback('版本格式错误，如：4.9.20');
        } else {
            callback();
        }
    },
    number: (rule, value, callback) => {
        let reg = /^[0-9]*$/;
        if (value && !reg.test(value)) {
            callback('请输入数字');
        } else {
            callback();
        }
    },
    //8-16位大小写字母、数字和特殊字符的组合,表单
    passwordForm: (rule, value, callback) => {
        //let reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*{}+=()-_])[\da-zA-Z~!@#$%^&*{}+=()-_]{8,16}$/;
        // let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+-,.\/<>?;':"{}|[\]\\\=])[A-Za-z\d~!@#$%^&*()_+-,.\/<>?;':"{}|[\]\\\=]{8,16}$/;
        let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+,.\/<>?;':"{}|[\]\\\=-])[A-Za-z\d~!@#$%^&*()_+,.\/<>?;':"{}|[\]\\\=-]{8,16}$/;
        if (value && !reg.test(value)) {
            callback('请输入8-16位大小写字母、数字和特殊字符组合');
        } else {
            callback();
        }
    },
    //8-16位大小写字母、数字和特殊字符的组合
    password: (value) => {
        //let reg = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*{}+=()-_])[\da-zA-Z~!@#$%^&*{}+=()-_]{8,16}$/;
        //Gao-353637验证失败
        //let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+-,.\/<>?;':"{}|[\]\\\=])[A-Za-z\d~!@#$%^&*()_+-,.\/<>?;':"{}|[\]\\\=]{8,16}$/;
        let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+,.\/<>?;':"{}|[\]\\\=-])[A-Za-z\d~!@#$%^&*()_+,.\/<>?;':"{}|[\]\\\=-]{8,16}$/;
        if (value && !reg.test(value)) {
            return false;
        } else {
            return true;
        }
    },
    //6位验证码
    code: (value) => {
        let reg = /^[0-9]*$/;
        if (value && value.length == 6 && reg.test(value)) {
            return true;
        } else {
            return false;
        }
    },
    //6位验证码
    codeForm: (rule, value, callback) => {
        let reg = /^[0-9]*$/;
        if (value && (value.length !== 6 || !reg.test(value))) {
            callback('请输入6位数字验证码');
        } else {
            callback();
        }
    },
    strongPassword: (rule, value, callback) => {
        const reg = /^[a-zA-Z](?!\d+$)(?![a-z]+$)(?![A-Z]+$)(?![!@#$%^&*()+?><.]+$)[a-zA-Z0-9!@#$%^&*()+?><.]{7,19}$/;
        if (value && !reg.test(value)) {
            callback('8-20位以字母开头的大小写字母、数字和特殊字符的组合，至少包含两种');
        } else {
            callback();
        }
    },
    account: (rule, value, callback) => {
        let reg = /^[A-Za-z0-9]{6,30}$/;
        if (value && !reg.test(value)) {
            callback('名称为不超过6-30位大小写字母或数字的字符组合');
        } else {
            callback();
        }
    },
    userNameIncludeTw: (rule, value, callback) => {
        let reg = /^[A-Za-z0-9\u4E00-\u9FA5]{0,20}$/;
        if (value && !reg.test(value)) {
            callback('名称为不超过20位大小写字母、数字、汉字的字符组合');
        } else {
            callback();
        }
    },
    userNameIncludeZh: (rule, value, callback) => {
        let reg = /^[A-Za-z0-9\u4E00-\u9FA5]{0,30}$/;
        if (value && !reg.test(value)) {
            callback('名称为不超过30位大小写字母、数字、汉字的字符组合');
        } else {
            callback();
        }
    },
    email: (rule, value, callback) => {
        let reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        if (value && !reg.test(value)) {
            callback('请输入正确格式的邮箱');
        } else {
            callback();
        }
    },
    telephone: (rule, value, callback) => {
        let reg = /^1[3456789]\d{9}$/;
        if (value && !reg.test(value)) {
            callback('请输入11位正确电话号码');
        } else {
            callback();
        }
    },
    telephoneInput: (value) => {
        let reg = /^1[3456789]\d{9}$/;
        if (value && !reg.test(value)) {
            return false;
        } else {
            return true;
        }
    },
    pictureFile: (rule, value, callback) => {
        if (value && value.fileList.length == 0) {
            callback(`请上传图片`);
        } else {
            callback();
        }
    },
    file: (rule, value, callback) => {
        if (value && value.fileList.length == 0) {
            callback(`请上传文件`);
        } else {
            callback();
        }
    },
    deviceName: (rule, value, callback) => {
        let reg = /^[\s\S]{1,30}$/;
        if (value && !reg.test(value)) {
            callback('不超过30位字符组合');
        } else {
            callback();
        }
    },
    deviceDesc: (rule, value, callback) => {
        if (value && value.length > 200) {
            callback('不超过200位字符组合');
        } else {
            callback();
        }
    },
    content: (rule, value, callback) => {
        if (value && value.length > 2000) {
            callback('不超过2000位字符');
        } else {
            callback();
        }
    },
    remark: (rule, value, callback) => {
        if (value && value.length > 200) {
            callback('不超过200字符');
        } else {
            callback();
        }
    },
    notifyTitle: (rule, value, callback) => {
        if (value && value.length > 20) {
            callback('不超过20个字符');
        } else {
            callback();
        }
    },
    idNum: (rule, id, callback) => {
        if (!id) {
            callback();
        }
        //校验身份证号码
        const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
        // 号码规则校验
        if (!format.test(id)) {
            callback(new Error('身份证号码错误'));
            return;
        }
        // 区位码校验
        // 出生年月日校验  前正则限制起始年份为1900;
        const year = id.substr(6, 4);
        // 身份证月
        const month = id.substr(10, 2);
        // 身份证日
        const date = id.substr(12, 2);
        // 身份证日期时间戳date
        const time = Date.parse(month + '-' + date + '-' + year);
        // 当前时间戳
        const now_time = Date.parse(new Date());
        // 身份证当月天数
        const dates = new Date(year, month, 0).getDate();
        if (time > now_time || date > dates) {
            // 出生日期不合规
            callback(new Error('身份证号码错误'));
            return;
        }
        // 校验码判断
        // 系数
        const c = [
            7,
            9,
            10,
            5,
            8,
            4,
            2,
            1,
            6,
            3,
            7,
            9,
            10,
            5,
            8,
            4,
            2
        ];
        // 校验码对照表
        const b = [
            '1',
            '0',
            'X',
            '9',
            '8',
            '7',
            '6',
            '5',
            '4',
            '3',
            '2'
        ];
        const id_array = id.split('');
        let sum = 0;
        for (let k = 0; k < 17; k++) {
            sum += parseInt(id_array[k], 10) * parseInt(c[k], 10);
        }
        if (id_array[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
            // 身份证校验码不合规
            callback(new Error('身份证号码错误'));
            return;
        }
        callback();
    }
};
export default validator;
