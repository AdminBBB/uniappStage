# project config.json 项说明

+ projectPath:string

打包后生成的上级路径，即打包后的实际路径为 unity/${projectPath}/${projectName}

+ projectName:string

项目名称,主要作用是关联打包后的生成路径，默认为项目的源文件目录名， 即打包后的实际路径为 unity/${projectPath}/${projectName}

+ indexJs :array

生成页面的主函数 默认['index'], 可以为嵌套文件夹例如 ['index'，'pages/p1/index'] 打包后的路径 与其相对应

+ version: 'assets',
+ title: '和家亲投放管理平台',

+ proxy: { '/resourceManage/': 'https://test.hsop.komect.com:10443/' },
+ projectSourcePath: 'D:\\workSpace\\Lab\\uniappStage\\src\\admin\\hjqLaunchAdmin',

+ buildPathBasicVersion: false,
+ projectSourcePathStr: 'src/admin/hjqLaunchAdmin'
