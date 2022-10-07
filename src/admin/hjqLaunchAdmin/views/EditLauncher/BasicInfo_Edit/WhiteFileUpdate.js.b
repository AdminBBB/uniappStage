/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2021/11/15.
 * Copyright 2021/11/15 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2021/11/15
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useState, useContext } from 'react';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FILE_TYPE_MAP } from '../../../common/FILE_TYPE_MAP';
import { extname } from '../../../service/utils';
import { COMMON_CONTEXT } from '../../../store';
import { uploadSpecificUserFile } from '../../../service/api';

export function WhiteFileUpdate (props) {
    const { value = {}, onChange } = props;
    // const [fileListPush, setFileListPush] = useState([]);
    const { state: { fileListPush }, dispatch } = useContext(COMMON_CONTEXT);
    const triggerChange = (changedValue) => {
        onChange?.(changedValue?.[0]?.name);
    };
    const _handleFileChange = ({ fileList }) => {
        //删除才设置setFileList， 新增则再handleUpload中设置
        if (fileListPush.length > fileList?.length) {
            // setFileListPush(fileList);
            dispatch({ fileListPush: fileList });
        }
    };
    //txt文件上传及请求接口
    const _handleUpload = (options) => {
        let file = options.file;
        const fileItem = {
            uid: file.uid, // 注意，这个uid一定不能少，否则上传失败
            name: file.name,
            status: 'uploading',
            url: '',
            percent: 99, // 注意不要写100。100表示上传完成
            type: FILE_TYPE_MAP[extname(file.name.toLowerCase())],
            size: file.size / 1024
        };
        let newFileList = [...fileListPush];
        message.loading('上传中', 0);
        //const _proCode = currentUnit.resourceScenes === 0 ? 'cdc' : '99';
        uploadSpecificUserFile(file).then((res) => {
            message.destroy();
            fileItem.status = 'done';
            fileItem.percent = 100;
            fileItem.name = res.fileName;
            fileItem.url = res.filePath;
            newFileList.push(fileItem);
            dispatch({ fileListPush: newFileList });
            // setFileListPush(newFileList);
            message.success('上传成功');
            triggerChange(newFileList);
        }).catch(err => {
            message.destroy();
            message.error(err.message || '上传失败');
        });
    };
    //txt文件上传前处理
    const _beforeUpload = (file) => {
        // console.log(file)
        let _regx = /.(txt)+$/gi;
        if (!_regx.test(file.name)) {
            message.error('请上传 txt 格式的文件!');
            return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 <= 500;
        if (!isLt5M) {
            message.error('文件大小不能超过500M！');
            return Upload.LIST_IGNORE;
        }
        return true;
    };
    return <Upload name="file"
                   beforeUpload={_beforeUpload}
                   onChange={_handleFileChange}
                   customRequest={_handleUpload}
                   maxCount={1}
                   showUploadList={
                       {
                           showDownloadIcon: true,
                           showRemoveIcon: true
                       }
                   }
                   fileList={fileListPush}
                   accept=".txt">
        {fileListPush.length >= 1 ? null : (
            <Button icon={<UploadOutlined />}>上传名单</Button>
        )}
    </Upload>;
}
