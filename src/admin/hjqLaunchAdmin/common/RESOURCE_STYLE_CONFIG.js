/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/2/10.
 * Copyright 2022/2/10 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/2/10
 * @version */
export const RESOURCE_STYLE_CONFIG = {
    'admin': {
        'pm': {
            '1': {
                'styleId': 1,//styleId为1时代表"首页-金刚区"和"享家-金刚区"
                // 'resourceName': '首页-金刚区',     //资源名称,
                'resourceOrder': false, //顺序范围
                'location': false,      //形态选择
                'maxPreCount': 0,  //最大申请周期,0表示长期
                'minDateUnit': 1,    //申请时间单位,日1或时0
                'applyLimitDays': 0,//申请时间锁定,即必须提前多少天申请，0表示无限制
                'thingsLimitDays': 0, //物料时间锁定,假设为1，则必须在上线前一天之前提交好物料，0表示无限制
                'resourceNote': true,    //基础属性-备注
                'titleLeftTitle': false,    //母属性-标题文案-左
                'titleLeftActionUrl': false,  //母属性-标题链接-左
                'titleMidTitle': false,  //母属性-标题文案-中
                'titleMidActionUrl': false,   //母属性-标题链接-中
                'titleRightTitle': false,    //母属性-标题文案-右
                'titleRightActionUrl': false,  //母属性-标题链接-右
                'pushContent': false,   //母属性-文案
                'target': false,  //母属性-独立名单
                'linkUrl': false,     //母属性-推送测试
                'description': false,  //母属性-备注
                'sonMaxLength': 20,   //子属性-子项数量范围
                'unitTitle': true,     //子属性-文案1
                'unitSubtitle': false, //子属性-文案2
                'imgUrl': true,    //子属性-图片
                'actionUrl': true,   //子属性-链接
                'extrInfo': true //子属性-备注
            },
            '2': {
                'styleId': 2,
                // 'resourceName': '首页-楼层位',
                'resourceOrder': 10,
                'location': [
                    {
                        'name': '上1下3',
                        'id': 1
                    },
                    {
                        'name': '上0下3',
                        'id': 2
                    },
                    {
                        'name': '上1下2',
                        'id': 3
                    },
                    {
                        'name': '上2下1',
                        'id': 4
                    },
                    {
                        'name': '左1右2',
                        'id': 5
                    },
                    {
                        'name': '左2右1',
                        'id': 6
                    },
                    {
                        'name': '左1右1',
                        'id': 7
                    }
                ],
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': true,
                'titleLeftActionUrl': true,
                'titleMidTitle': true,
                'titleMidActionUrl': true,
                'titleRightTitle': true,
                'titleRightActionUrl': true,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 4,
                'unitTitle': true,
                'unitSubtitle': true,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': true
            },
            '3': {
                'styleId': 3,
                // 'resourceName': '享家-楼层位',
                'resourceOrder': 10,
                'location': [
                    {
                        'name': '上1下3',
                        'id': 1
                    },
                    {
                        'name': '上0下3',
                        'id': 2
                    },
                    {
                        'name': '上1下2',
                        'id': 3
                    },
                    {
                        'name': '上2下1',
                        'id': 4
                    },
                    {
                        'name': '左1右2',
                        'id': 5
                    },
                    {
                        'name': '左2右1',
                        'id': 6
                    },
                    {
                        'name': '左1右1',
                        'id': 7
                    }
                ],
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': true,
                'titleLeftActionUrl': true,
                'titleMidTitle': true,
                'titleMidActionUrl': true,
                'titleRightTitle': true,
                'titleRightActionUrl': true,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 4,
                'unitTitle': true,
                'unitSubtitle': true,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': true
            },
            '10': {
                'styleId': 10,
                // 'resourceName': '连接-顶部入口模块',
                'resourceOrder': 20,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': false,
                'sonMaxLength': 20,
                'unitTitle': true,
                'unitSubtitle': true,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': true
            },
            '11': {
                'styleId': 11,
                // 'resourceName': '连接-Banner',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'momImg': true,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 1,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': false
            },
            '12': {
                'styleId': 12,
                // 'resourceName': '服务-服务区入口',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': true,
                'titleLeftActionUrl': true,
                'titleMidTitle': true,
                'titleMidActionUrl': true,
                'titleRightTitle': true,
                'titleRightActionUrl': true,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 20,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': true
            },
            '13': {
                'styleId': 13,
                // 'resourceName': '我家-主要位置',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 1,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': false
            },
            '14': {
                'styleId': 14,
                // 'resourceName': '我家-服务列表',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': true,
                'titleLeftActionUrl': true,
                'titleMidTitle': true,
                'titleMidActionUrl': true,
                'titleRightTitle': true,
                'titleRightActionUrl': true,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 20,
                'unitTitle': true,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': true
            }
        },
        'om': {
            '4': {
                'styleId': 4,
                // 'resourceName': '首页-Banner', '享家-Banner'
                'resourceOrder': { 10: '首页-Banner', 0: '享家-Banner' },
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 1,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': false
            },
            '5': {
                'styleId': 5,
                // 'resourceName': '首页-角标',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 1,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': false
            },
            '15': {
                'styleId': 15,
                // 'resourceName': '首页-图墙',
                'resourceOrder': 10,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 1,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': false
            }
        },
        'origin': {
            '6': {
                'styleId': 6,
                // 'resourceName': 'APP-弹窗',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'actionUrl': true,
                'imgUrl': true,
                'triggerDesc': true
            },
            '7': {
                'styleId': 7,
                // 'resourceName': 'APP-开机屏',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'actionUrl': true,
                'imgUrl': true,
                'triggerDesc': true
            },
            '8': {
                'styleId': 8,
                // 'resourceName': 'APP-PUSH',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 0,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'title': true,
                'pushContent': true,
                'linkUrl': true,
                'target': true,
                'remark': true
            },
            '9': {
                'styleId': 9,
                // 'resourceName': 'APP-短信',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 0,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'pushContent': true,
                'target': true,
                'remark': true
            }
        }
    },
    'applicant': {
        'pm': {
            '2': {
                'styleId': 2,
                // 'resourceName': '首页-楼层位',
                'resourceOrder': 5,
                'location': [
                    {
                        'name': '上1下3',
                        'id': 1
                    },
                    {
                        'name': '上0下3',
                        'id': 2
                    },
                    {
                        'name': '上1下2',
                        'id': 3
                    },
                    {
                        'name': '上2下1',
                        'id': 4
                    },
                    {
                        'name': '左1右2',
                        'id': 5
                    },
                    {
                        'name': '左2右1',
                        'id': 6
                    },
                    {
                        'name': '左1右1',
                        'id': 7
                    }
                ],
                'maxPreCount': 31,
                'minDateUnit': 1,
                'applyLimitDays': 4,
                'thingsLimitDays': 2,
                'resourceNote': true,
                'titleLeftTitle': true,
                'titleLeftActionUrl': true,
                'titleMidTitle': true,
                'titleMidActionUrl': true,
                'titleRightTitle': true,
                'titleRightActionUrl': true,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 4,
                'unitTitle': true,
                'unitSubtitle': true,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': true
            },
            '10': {
                'styleId': 10,
                // 'resourceName': '连接-顶部入口模块',
                'resourceOrder': 20,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': false,
                'sonMaxLength': 20,
                'unitTitle': true,
                'unitSubtitle': true,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': true
            },
            '11': {
                'styleId': 11,
                // 'resourceName': '连接-Banner',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 1,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': false
            },
            '12': {
                'styleId': 12,
                // 'resourceName': '服务-服务区入口',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': true,
                'titleLeftActionUrl': true,
                'titleMidTitle': true,
                'titleMidActionUrl': true,
                'titleRightTitle': true,
                'titleRightActionUrl': true,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 20,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': true
            },
            '13': {
                'styleId': 13,
                // 'resourceName': '我家-主要位置',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 1,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': false
            },
            '14': {
                'styleId': 14,
                // 'resourceName': '我家-服务列表',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': true,
                'titleLeftActionUrl': true,
                'titleMidTitle': true,
                'titleMidActionUrl': true,
                'titleRightTitle': true,
                'titleRightActionUrl': true,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 20,
                'unitTitle': true,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': true
            }
        },
        'om': {
            '4': {
                'styleId': 4,
                // 'resourceName': '首页-Banner',
                'resourceOrder': 5,
                'location': false,
                'maxPreCount': 7,
                'minDateUnit': 1,
                'applyLimitDays': 4,
                'thingsLimitDays': 2,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 1,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': false
            },
            '5': {
                'styleId': 5,
                // 'resourceName': '首页-角标',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 3,
                'minDateUnit': 1,
                'applyLimitDays': 4,
                'thingsLimitDays': 2,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 1,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': false
            },
            '8': {
                'styleId': 8,
                // 'resourceName': '首页-信息流位置',
                'resourceOrder': 20,
                'location': false,
                'maxPreCount': 7,
                'minDateUnit': 1,
                'applyLimitDays': 4,
                'thingsLimitDays': 2,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                // "momLink":true,
                // "momImg":true,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': false,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': false,
                'actionUrl': false,
                'extrInfo': false
            },
            '27': {
                'styleId': 27,
                // 'resourceName': '其他-安防Banner',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 0,
                'minDateUnit': 1,
                'applyLimitDays': 0,
                'thingsLimitDays': 0,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                // "momLink":true,
                // "momImg":true,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': false,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': false,
                'actionUrl': false,
                'extrInfo': false
            },
            '15': {
                'styleId': 15,
                // 'resourceName': '首页-图墙',
                'resourceOrder': 10,
                'location': false,
                'maxPreCount': 7,
                'minDateUnit': 1,
                'applyLimitDays': 4,
                'thingsLimitDays': 2,
                'resourceNote': true,
                'titleLeftTitle': false,
                'titleLeftActionUrl': false,
                'titleMidTitle': false,
                'titleMidActionUrl': false,
                'titleRightTitle': false,
                'titleRightActionUrl': false,
                'pushContent': false,
                'target': false,
                'linkUrl': false,
                'description': true,
                'sonMaxLength': 1,
                'unitTitle': false,
                'unitSubtitle': false,
                'imgUrl': true,
                'actionUrl': true,
                'extrInfo': false
            },
            'origin': {
                '6': {
                    'styleId': 6,
                    // 'resourceName': 'APP-弹窗',
                    'resourceOrder': false,
                    'location': false,
                    'maxPreCount': 1,
                    'minDateUnit': 1,
                    'applyLimitDays': 4,
                    'thingsLimitDays': 2,
                    'resourceNote': true,
                    'actionUrl': true,
                    'imgUrl': true,
                    'triggerDesc': true
                },
                '7': {
                    'styleId': 7,
                    // 'resourceName': 'APP-开机屏',
                    'resourceOrder': false,
                    'location': false,
                    'maxPreCount': 1,
                    'minDateUnit': 1,
                    'applyLimitDays': 4,
                    'thingsLimitDays': 2,
                    'resourceNote': true,
                    'actionUrl': true,
                    'imgUrl': true,
                    'triggerDesc': true
                },
                '8': {
                    'styleId': 8,
                    // 'resourceName': 'APP-PUSH',
                    'resourceOrder': false,
                    'location': false,
                    'maxPreCount': 1,
                    'minDateUnit': 0,
                    'applyLimitDays': 4,
                    'thingsLimitDays': 2,
                    'resourceNote': true,
                    'title': true,
                    'pushContent': true,
                    'linkUrl': true,
                    'target': true,
                    'remark': true
                },
                '9': {
                    'styleId': 9,
                    // 'resourceName': 'APP-短信',
                    'resourceOrder': false,
                    'location': false,
                    'maxPreCount': 1,
                    'minDateUnit': 0,
                    'applyLimitDays': 4,
                    'thingsLimitDays': 2,
                    'resourceNote': true,
                    'pushContent': true,
                    'target': true,
                    'remark': true
                }
            }
        },
        'origin': {
            '6': {
                'styleId': 6,
                // 'resourceName': 'APP-弹窗',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 1,
                'minDateUnit': 1,
                'applyLimitDays': 4,
                'thingsLimitDays': 2,
                'resourceNote': true,
                'actionUrl': true,
                'imgUrl': true,
                'triggerDesc': true
            },
            '7': {
                'styleId': 7,
                // 'resourceName': 'APP-开机屏',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 1,
                'minDateUnit': 1,
                'applyLimitDays': 4,
                'thingsLimitDays': 2,
                'resourceNote': true,
                'actionUrl': true,
                'imgUrl': true,
                'triggerDesc': true
            },
            '8': {
                'styleId': 8,
                // 'resourceName': 'APP-PUSH',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 1,
                'minDateUnit': 0,
                'applyLimitDays': 4,
                'thingsLimitDays': 2,
                'resourceNote': true,
                'title': true,
                'pushContent': true,
                'linkUrl': true,
                'target': true,
                'remark': true
            },
            '9': {
                'styleId': 9,
                // 'resourceName': 'APP-短信',
                'resourceOrder': false,
                'location': false,
                'maxPreCount': 1,
                'minDateUnit': 0,
                'applyLimitDays': 4,
                'thingsLimitDays': 2,
                'resourceNote': true,
                'pushContent': true,
                'target': true,
                'remark': true
            }
        }
    }
};

