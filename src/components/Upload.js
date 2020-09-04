import React from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Error_modal } from '@/utils/Modal';
class UploadComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    // props: multi=true 多个文件上传   filelist
  }

  handleRemovefile = file => {
    const index = this.state.fileList.indexOf(file);
    const newFileList = this.state.fileList.slice();
    newFileList.splice(index, 1);
    this.props.filelist(newFileList);
    this.setState({
      fileList: newFileList,
    });
  };

  handleChangefile = info => {
    if (info.file.status === 'done') {
      // message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      Error_modal(`${info.file.name} 上传失败`);
    }
    let fileList = [...info.fileList];

    if (!this.props.multi) {
      fileList = fileList.slice(-1); //上传一个文件
    }

    this.setState({ fileList: fileList });

    this.props.filelist(fileList);
  };

  render() {
    const uploadProps = {
      name: 'file',
      action: window.SERVER + '/api/uploadFile',
      headers: {
        // authorization: 'authorization-text',
      },
      onChange: this.handleChangefile,
      onRemove: this.handleRemovefile,
    };

    return (
      <Upload {...uploadProps} fileList={this.state.fileList}>
        <Button style={{ margin: '20px 0 ' }}>
          <UploadOutlined /> 上传
        </Button>
      </Upload>
    );
  }
}

export default UploadComp;
