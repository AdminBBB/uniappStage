/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/1/28.
 * Copyright 2022/1/28 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/1/28
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { FILE_TYPE_MAP } from '../../../../common/FILE_TYPE_MAP';
import { extname } from '../../../../service/utils';
import { uploadWhiteUserFile } from '../../../../service/api';

function getBase64 (file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
export function UploadFile (props) {
    const {
        resourceScenes, value, onChange = () => {
        }
    } = props;
    const [fileUrl, setFileUrl] = useState(null);
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
    const _handleFileChange = ({ fileList }) => {
        //删除才设置setImgList， 新增则再handleUpload中设置
        setFileUrl(fileList.length ? fileList[0] : null);
    };
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
        message.loading('上传中', 0);
        //  const _proCode = resourceScenes === 0 ? 'cdc' : '99';
        uploadWhiteUserFile(file).then((res) => {
            message.destroy();
            fileItem.status = 'done';
            fileItem.percent = 100;
            fileItem.name = res.fileName;
            fileItem.url = res.filePath;
            // setFileUrl(fileItem);
            message.success('上传成功');
            onChange?.({ url: fileItem.url, name: fileItem.name });
        }).catch(err => {
            message.destroy();
            message.error(err.message || '上传失败');
        });
    };
    useEffect(() => {
        setFileUrl(value ? {
            uid: '0',
            status: 'done',
            percent: 100,
            name: value.name,
            url: value.url
        } : null);
    }, [value]);
    return <Upload
        name="file"
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
        fileList={fileUrl ? [fileUrl] : []}
        accept=".txt">
        {fileUrl === null && <Button icon={<UploadOutlined />}>上传名单</Button>}
    </Upload>;
}
