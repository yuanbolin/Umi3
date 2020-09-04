import React, { Component } from 'react';
import { Button, Form, Input, Spin } from 'antd';
import { UserOutlined, LoadingOutlined, LockOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { post } from '@/utils/http';
import style from './index.less';

const FormItem = Form.Item;
class Login extends Component {
  state = { loading: false };

  onFinish = values => {
    console.log('value', values);
    history.push('/main');
    // post('authenticate', values).then(res => {
    //   const data = res.data;
    //   sessionStorage.clear(); // 重新登录时，需要清楚刚才的
    //   sessionStorage.setItem('token', data.id_token);
    //   history.push('/admin');
    // });
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
      <div className={style.Login}>
        <div className={style.loginBox}>
          <div className={style.content}>
            <Form
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              className="login-form"
            >
              {/*<FormItem>*/}
              {/*  {getFieldDecorator('username', {*/}
              {/*    rules: [{ required: true, message: '请输入用户名' }],*/}
              {/*  })(<Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='用户名' />)}*/}
              {/*</FormItem>*/}
              <Form.Item
                name="username"
                noStyle
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={
                    <UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="用户名"
                />
              </Form.Item>
              <Form.Item
                name="password"
                noStyle
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input
                  prefix={
                    <LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              </Form.Item>
              {/*<FormItem>*/}
              {/*  {getFieldDecorator('password', {*/}
              {/*    rules: [{ required: true, message: '请输入密码' }],*/}
              {/*  })(*/}
              {/*    <Input*/}
              {/*      prefix={*/}
              {/*        <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />*/}
              {/*      }*/}
              {/*      type="password"*/}
              {/*      placeholder="密码"*/}
              {/*    />,*/}
              {/*  )}*/}
              {/*</FormItem>*/}
              <FormItem>
                <Spin spinning={this.state.loading} indicator={antIcon}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={style.loginFormButton}
                  >
                    登录
                  </Button>
                </Spin>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
