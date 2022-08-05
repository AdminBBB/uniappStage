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
import { PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { FILE_TYPE_MAP } from '../../../../common/FILE_TYPE_MAP';
import { extname } from '../../../../service/utils';
import { uploadPhoto } from '../../../../service/api';

function getBase64 (file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
let imgPromise = false;
export function UploadImg (props) {
    const {
        resourceScenes, value, onChange = () => {
        }
    } = props;
    const [imgUrl, setImgUrl] = useState(null);
    const _beforeUpload = (file) => {
        imgPromise = true;
        let _regx = /.(jpg|png|jpeg|gif)+$/gi;
        if (!_regx.test(file.name)) {
            message.error('请上传 jpg、png、jpeg、gif格式的文件!');
            imgPromise = false;
            return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 <= 1;
        if (!isLt5M) {
            message.error('文件大小不能超过1M！');
            imgPromise = false;
            return Upload.LIST_IGNORE;
        }
        return true;
    };
    const _handleFileChange = ({ fileList }) => {
        //删除才设置setImgList， 新增则再handleUpload中设置
        setImgUrl((fileList.length && imgPromise)? fileList[0] : null);
    };
    const _handleUpload = (options) => {
        if (!imgPromise) {
            return false;
        }
        // setImgUrl(fileList.length ? fileList[0] : null);
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
        const _proCode = resourceScenes === 0 ? 'cdc' : '99';
        uploadPhoto({ photo: file, isCompress: 1, proCode: _proCode }).then((res) => {
            message.destroy();
            fileItem.status = 'done';
            fileItem.percent = 100;
            fileItem.url = res.url;
            fileItem.thumbUrl = res.url;
            setImgUrl(fileItem);
            message.success('上传成功');
            onChange?.(fileItem.url);
        }).catch(err => {
            message.destroy();
            message.error(err.message || '上传失败');
        });
    };
    useEffect(() => {
        setImgUrl(value ? {
            uid: '0',
            status: 'done',
            percent: 100,
            url: value,
            thumbUrl: value
        } : null);
    }, [value]);
    return <Upload
        name="photo"
        listType="picture-card"
        beforeUpload={_beforeUpload}
        onChange={_handleFileChange}
        // onPreview={handlePreview}
        customRequest={_handleUpload}
        // disabled={isEditable === 0 || (isEditable === 2 && unitReviewMap?.imgUrl?.reviewResult === 1)}
        showUploadList={
            {
                showPreviewIcon: true,
                showDownloadIcon: false,
                showRemoveIcon: true
            }
        }
        fileList={imgUrl ? [imgUrl] : []}
        accept="image/*">
        {imgUrl === null && (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">点击</div>
            </div>)
        }
    </Upload>;
}
