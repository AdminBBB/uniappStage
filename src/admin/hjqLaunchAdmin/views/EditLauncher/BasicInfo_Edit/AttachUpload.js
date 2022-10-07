/**
 * File Created by wangshuyan@cmhi.chinamobile.com at 2022/8/24.
 * Copyright 2022/8/24 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan@cmhi.chinamobile.com
 * @date 2022/8/24
 * @version */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export function AttachUpload (props) {
    const { value = [], onChange, api, maxCount, btnText, extName, extReg, maxSize } = props;
    const [fileList, setFileList] = useState([]);
    const attachFileListRef = useRef([]);
    const [loadingBar, setLoadingBar] = useState(0);
    const triggerChange = (changedValue) => {
        onChange?.(changedValue);
    };
    const beforeUploadHandler = (file) => {
        if (extReg && !extReg.test(file.name)) {
            message.error(`请上传 ${extName} 格式的文件!`);
            return Upload.LIST_IGNORE;
        }
        if (maxSize) {
            const isLt5M = file.size / 1024 / 1024 <= maxSize;
            if (!isLt5M) {
                message.error(`文件大小不能超过${maxSize}M！`);
                return Upload.LIST_IGNORE;
            }
        }
        return true;
    };
    const removeHandler = (res) => {
        const fileListResolve = fileList.filter(f => {
            return f.name !== res.name;
        });
        setAttachFileList(fileListResolve, true);
    };
    const uploadHandler = async (options) => {
        const { file } = options;
        if (attachFileListRef.current.length < maxCount) {
            try {
                const res = await api(file, ({ total, loaded }) => {
                    setLoadingBar(Math.round(loaded / total * 100));
                });
                setLoadingBar(0);
                const { fileName, filePath } = res;
                const fileListResolve = [...attachFileListRef.current, { name: fileName, url: filePath }];
                setAttachFileList(fileListResolve, true);
            } catch (e) {
                console.log('e', e);
            }
        }
    };
    const setAttachFileList = (fileListResolve, tr = false) => {
        attachFileListRef.current = fileListResolve;
        if (tr) {
            triggerChange(fileListResolve);
        }
    };
    useEffect(() => {
        if (Array.isArray(value)) {
            setFileList(value);
            setAttachFileList(value, false);
        }
    }, [value]);
    return <div className={'g-uploadAttachFileWrap'}>
        <Upload className={`uploadCom ${fileList.length >= maxCount ? 'disabled' : 'nor'}`}
                beforeUpload={beforeUploadHandler}
                customRequest={uploadHandler}
                onRemove={removeHandler}
                openFileDialogOnClick={fileList.length < maxCount}
                fileList={fileList}
                showUploadList={
                    {
                        showDownloadIcon: true,
                        showRemoveIcon: true
                    }
                }>
            
            <Button icon={<UploadOutlined />}>{btnText}</Button>
        </Upload>
        <div className={`upload-loadingbar ${loadingBar === 0 ? 'hide' : 'process'}`}>
            <div className={'loading-bar'}>
                <div className={'loading-line'} style={{ width: loadingBar + '%' }}>
                    {loadingBar}%
                </div>
            </div>
        </div>
    </div>;
}
