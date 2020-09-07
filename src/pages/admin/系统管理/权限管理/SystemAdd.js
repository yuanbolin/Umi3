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
  Table,
  DatePicker,
  Modal,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
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
    this.formRef = React.createRef();
    this.formRef2 = React.createRef();
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

  submit = async () => {
    let queryConditions = await this.formRef.current.validateFields();
    let queryConditions2 = await this.formRef2.current.validateFields();
  };

  render() {
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
          <Form ref={this.formRef} {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item
                  label="登录账号："
                  name="dlzh"
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
                >
                  <Search allowClear />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="用户昵称：" name="yhnc">
                  <Search allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="电子邮箱" name="email">
                  <Search allowClear />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="手机号码" name="mobilephone">
                  <Search />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="办公电话" name="call">
                  <Search allowClear />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="权重(排序)：" name="px">
                  <Input
                    placeholder="权值越大排名越靠前，请填写数字"
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item
                  label="备注信息"
                  wrapperCol={{ span: 19 }}
                  labelCol={{ span: 3 }}
                  name="bz"
                >
                  <TextArea rows={4} />
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
            <Form ref={this.formRef2} {...formItemLayout}>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="String 1" name="s1">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="String 2" name="s2">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="String 3" name="s3">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="String 4" name="s4">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="Integer 1" name="i1">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Integer 2" name="i2">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="Integer 3" name="i3">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Integer 4" name="i4">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="Float  1" name="f1">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Float  2" name="f2">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="Float  3" name="f3">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Float  4" name="f4">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="Date 1" name="d1">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Date 2" name="d2">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={10} offset={1}>
                  <Form.Item label="Date 3" name="d3">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label="Date 4" name="d4">
                    <Input />
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
            <QuestionCircleOutlined
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
export default connect()(SystemAdd);
