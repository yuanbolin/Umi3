import React, { Component } from 'react';
import { Button, Input, message } from 'antd';
import { get, put } from '@/utils/http';

class EditUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.submitData.userId = sessionStorage.getItem('id');
    this.getUserInfo();
  }

  getUserInfo = () => {
    get('authenticate').then(res => {
      this.setState({ data: res.data });
    });
  };

  handleInputChange = event => {
    this.submitData[event.target.name] = event.target.value;
  };

  editInfo = () => {
    if (this.submitData.name !== '' && this.submitData.phone !== '') {
      put(`user-infos-update`, this.submitData)
        .then(res => {
          message.success('修改成功');
          sessionStorage.setItem('name', this.submitData.name);
          sessionStorage.setItem('phone', this.submitData.phone);
        })
        .catch();
    } else {
      message.error('输入不能为空');
    }
  };

  submitData = {
    name: sessionStorage.getItem('name'),
    phone: sessionStorage.getItem('phone') !== 'null' ? sessionStorage.getItem('phone') : '',
    userId: '',
  };

  render() {
    return (
      <div id='edit_password_div'>
        <h1 className='h3'>个人信息</h1>
        <label>登录账户</label>
        <Input value={this.state.data} disabled className='input_div' />
        <br />
        <label>姓&emsp;名&emsp;</label>
        <Input
          name='name'
          onChange={this.handleInputChange}
          defaultValue={sessionStorage.getItem('name')}
          className='input_div'
        />
        <br />
        <label>电&emsp;话&emsp;</label>
        <Input
          name='phone'
          onChange={this.handleInputChange}
          defaultValue={sessionStorage.getItem('phone') !== 'null' ? sessionStorage.getItem('phone') : ''}
          className='input_div'
        />
        <br />

        <Button type='default' className='editPw_btn' onClick={this.editInfo}>
          提交
        </Button>
      </div>
    );
  }
}

export default EditUserInfo;
