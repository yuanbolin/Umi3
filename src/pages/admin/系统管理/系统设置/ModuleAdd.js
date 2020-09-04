/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react';
import { Button, Col, Divider, Input, Row, Select, Form, Icon, Table, DatePicker, Modal } from 'antd';
import { get } from '@/utils/http';
import styles from './Module.less';
import { connect ,history} from 'umi';

const { Option } = Select;
const { TextArea, Search } = Input;

class ModuleAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: 'block',
      Show: '扩展字段 +',
    };
  }

  componentDidMount() {
    // this.fetch();
  }

  handleShow = () => {
    this.state.Show === '扩展字段 +'
      ? this.setState({ isShow: 'none', Show: '收起' })
      : this.setState({ isShow: 'block', Show: '扩展字段 +' });
  };

  handleClose = () => {
    this.props.dispatch({
      type: 'routerTabs/closePage',
      payload: { closePath: this.props.location.pathname },
    });
    history.goBack();
  };

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false;
      console.log(values);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
    };
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '角色编码',
        dataIndex: 'code',
      },
    ];

    return (
      <div className={styles.contentbox}>
        <div className={styles.header}>
          <span className={styles.tit}>新增模块</span>
        </div>
        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Form {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='模块名称：'>
                  {getFieldDecorator('mkmc', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='模块编码：'>{getFieldDecorator('mkbm', {rules: [
                    {
                      required: true,
                      message: '必填!',
                    },
                  ],})(<Input allowClear />)}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item label='主类全名' wrapperCol={{ span: 19 }} labelCol={{ span: 3 }}>
                  {getFieldDecorator('zlqm', {})(<Input placeholder='com.jeesite.modules.sys.web.LoginController' allowClear/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item label='模块描述' wrapperCol={{ span: 19 }} labelCol={{ span: 3 }}>
                  {getFieldDecorator('mkms', {})(<TextArea rows={4} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='当前版本：'>
                  {getFieldDecorator('bb', {
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Divider/>

          <Button type='primary' style={{ marginLeft: 160 }} onClick={this.submit}>
            保存
          </Button>
          <Button type='default' style={{ marginLeft: 15 }} onClick={this.handleClose}>
            关闭
          </Button>
        </div>
      </div>
    );
  }
}
export default connect() (Form.create()(ModuleAdd));
