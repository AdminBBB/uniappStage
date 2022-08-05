/**
 * @Desc
 * @author hufangqin
 * @date 2021/11/4
 * @version */
// 测试环境
const data = {
    myHomeData:{
        functionConfig: [{
            'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_icon_xiaoxi.png',
            'serviceTitle': '视频聊',
            'serviceUrl': 'www.baidu.com',
            'serviceName': 'shipinliao',
            native:true

        },
        {
            'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/familyManage_busi_icon_banxue.png?v=3',
            'serviceTitle': '和TA一起学',
            'serviceUrl': 'https://ajjy.hsop.komect.com/dh-apph5/hjbxH5/?passId=${passId}&JSESSIONID=${JSESSIONID}&mobile=${phoneNum}',
            'serviceName': 'banxue',
            native:false
        },
        {
            'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_icon_chonghuafei.png',
            'serviceTitle': '充话费',
            'serviceUrl': 'https://base.hjq.komect.com/auth/thirdApp/authentication?token=${token}&appH5Id=rechargecredit&phoneNum=${phone}',
            'serviceName': 'chonghuafei',
            native:true

        },
        {
            'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_icon_chongliuliang.png',
            'serviceTitle': '充流量',
            'serviceUrl': 'https://base.hjq.komect.com/auth/thirdApp/authentication?token=${token}&appH5Id=payFlow&phoneNum=${phone}',
            'serviceName': 'chongliuliang',
            native:true

        }
        ]
    }
};

// 线上环境
const data2 = {
    myHomeData:{
        functionConfig: [{
            'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_icon_xiaoxi.png',
            'serviceTitle': '视频聊',
            'serviceUrl': 'www.baidu.com',
            'serviceName': 'shipinliao',
            native:true

        },
        {
            'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/familyManage_busi_icon_banxue.png?v=3',
            'serviceTitle': '和TA一起学',
            'serviceUrl': 'https://read.hjq.komect.com/dh-apph5/hjbxH5/?currentPage=2&passId=${passId}&JSESSIONID=${JSESSIONID}&mobile=${phoneNum}&homeState=1',
            'serviceName': 'banxue',
            native:false
        },
        {
            'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_icon_chonghuafei.png',
            'serviceTitle': '充话费',
            'serviceUrl': 'https://base.hjq.komect.com/auth/thirdApp/authentication?token=${token}&appH5Id=rechargecredit&phoneNum=${phone}',
            'serviceName': 'chonghuafei',
            native:true

        },
        {
            'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myHomeIndex_icon_chongliuliang.png',
            'serviceTitle': '充流量',
            'serviceUrl': 'https://base.hjq.komect.com/auth/thirdApp/authentication?token=${token}&appH5Id=payFlow&phoneNum=${phone}',
            'serviceName': 'chongliuliang',
            native:true

        }
        ]
    }
};

// v6.0.0  myHomeBusiDataV2
// 测试
const data31 = {
    myHomeData:{
        functionConfig: [{
            'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myhome_v6_icon_shipinliao.png',
            'serviceTitle': '视频聊',
            'serviceUrl': 'www.baidu.com',
            'serviceName': 'shipinliao',
            native:true

        },
        {
            'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myhome_v6_icon_hetayiqixue.png?v=3',
            'serviceTitle': '和TA一起学',
            'serviceUrl': 'https://read.hjq.komect.com/dh-apph5/hjbxH5/?currentPage=2&passId=${passId}&JSESSIONID=${JSESSIONID}&mobile=${phoneNum}&homeState=1',
            'serviceName': 'banxue',
            native:false
        }
        ],
        shareConfigUrl:'https://ajjy.hsop.komect.com/dh-admin/hjq-family/index.html'
    }
};

// 线上
const data3 = {
    myHomeData:{
        functionConfig: [{
            'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myhome_v6_icon_shipinliao.png',
            'serviceTitle': '视频聊',
            'serviceUrl': 'www.baidu.com',
            'serviceName': 'shipinliao',
            native:true

        },
        {
            'serviceIcon': 'https://base.hjq.komect.com/file16/appclientH5/appresource/image/web/web/x3/myhome_v6_icon_hetayiqixue.png?v=3',
            'serviceTitle': '和TA一起学',
            'serviceUrl': 'https://read.hjq.komect.com/dh-apph5/hjbxH5/?currentPage=2&passId=${passId}&JSESSIONID=${JSESSIONID}&mobile=${phoneNum}&homeState=1',
            'serviceName': 'banxue',
            native:false
        }
        ],
        shareConfigUrl:'https://ua.hsop.komect.com:14444/dh-admin/hjq-family/index.html?phoneNum=${phoneNum}&token=${token}'
    }
};
