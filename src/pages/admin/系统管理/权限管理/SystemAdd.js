/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react';
import {
  Button,
  Col,
  Divider,
  Input,
  Row,
  Select,
  Form,
  Icon,
  Table,
  DatePicker,
  Modal,
} from 'antd';
import { get } from '@/utils/http';
import { connect, history } from 'umi';
import styles from './System.less';

const { Option } = Select;
const { TextArea, Search } = Input;

class SystemAdd extends Component {
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
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          'selectedRows: ',
          selectedRows,
        );
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
          <span className={styles.tit}>新增管理员</span>
        </div>
        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Form {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="登录账号：">
                  {getFieldDecorator('dlzh', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                  })(<Search allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="用户昵称：">
                  {getFieldDecorator('yhnc', {})(<Search allowClear />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="电子邮箱">
                  {getFieldDecorator('email', {})(<Search allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="手机号码">
                  {getFieldDecorator('mobilephone', {})(<Search />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="办公电话">
                  {getFieldDecorator('call', {})(<Search allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="权重(排序)：">
                  {getFieldDecorator(
                    'px',
                    {},
                  )(
                    <Input
                      placeholder="权值越大排名越靠前，请填写数字"
                      allowClear
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item
                  label="备注信息"
                  wrapperCol={{ span: 19 }}
                  labelCol={{ span: 3 }}
                >
                  {getFieldDecorator('bz', {})(<TextArea rows={4} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <p className={styles.addtit}>分配角色</p>
          <Divider />
          <Table
            dataSource={this.state.dataSource}
            columns={columns}
            rowKey={record => record.id}
            pagination={this.state.pagination}
            loading={this.state.loading}
            rowSelection={rowSelection}
          />

          <Button
            className={styles.addtit}
            type="link"
            onClick={this.handleShow}
          >
            扩展字段 +
          </Button>
          <Divider />
          <div style={{ display: this.state.isShow }}>
            <Form {...formItemLayout}>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="String 1">
                    {getFieldDecorator('s1', {})(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="String 2">
                    {getFieldDecorator('s2', {})(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="String 3">
                    {getFieldDecorator('s3', {})(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="String 4">
                    {getFieldDecorator('s4', {})(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="Integer 1">
                    {getFieldDecorator('i1', {})(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Integer 2">
                    {getFieldDecorator('i2', {})(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="Integer 3">
                    {getFieldDecorator('i3', {})(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Integer 4">
                    {getFieldDecorator('i4', {})(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="Float  1">
                    {getFieldDecorator('f1', {})(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Float  2">
                    {getFieldDecorator('f2', {})(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="Float  3">
                    {getFieldDecorator('f3', {})(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Float  4">
                    {getFieldDecorator('f4', {})(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="Date 1">
                    {getFieldDecorator('d1', {})(<DatePicker />)}
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Date 2">
                    {getFieldDecorator('d2', {})(<DatePicker />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="Date 3">
                    {getFieldDecorator('d3', {})(<DatePicker />)}
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Date 4">
                    {getFieldDecorator('d4', {})(<DatePicker />)}
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
            </Form>
          </div>
          <Button
            type="primary"
            style={{ marginLeft: 160 }}
            onClick={this.submit}
          >
            保存
          </Button>
          <Button
            type="default"
            style={{ marginLeft: 15 }}
            onClick={this.handleClose}
          >
            关闭
          </Button>
        </div>

        <Modal
          title="信息"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>
            <Icon
              type="question-circle"
              style={{
                color: '#FFCC00',
                fontSize: '30px',
                paddingRight: '10px',
              }}
            />
            你确认要删除这条数据吗？
          </p>
        </Modal>
      </div>
    );
  }
}
export default connect()(Form.create()(SystemAdd));
