/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react';
import { Button, Col, Divider, Input, Row, Select, Form, message } from 'antd';
import { connect, history } from 'umi';
import { get, post, put } from '@/utils/http';
import styles from './Company.less';
import OrgTreeSelect from '@/components/OrgTreeSelect';

const { Option } = Select;
const { TextArea, Search } = Input;

class OrganizeAdd extends Component {
  constructor(props) {
    super(props);
    this.pageType = this.props.match.params.id ? 'edit' : 'add'; // 判断页面是编辑还是新增
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    if (this.pageType === 'edit') this.getDetail();
  }

  getDetail = () => {
    get(`sys-offices/${this.props.match.params.id}`).then(res => {
      this.setState({ data: res.data });
    });
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
      if (this.pageType === 'edit') {
        const id = this.props.match.params.id;
        const newParams = { id, ...this.state.data, ...values };
        put('sys-offices', newParams).then(res => {
          message.success(`编辑成功`);
        });
      } else {
        const newParams = { ...values };
        post('sys-offices', newParams).then(res => {
          message.success(`新增成功`);
        });
      }
    });
  };

  render() {
    const { data } = this.state;
    const sysOffice = data.sysOffice ? data.sysOffice : {};
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    return (
      <div className={styles.contentbox}>
        {/* <div className={styles.header}> */}
        {/*  <span className={styles.tit}>{this.state.title}机构</span> */}
        {/* </div> */}
        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Form {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="上级机构">
                  {getFieldDecorator(`parentCode`, {
                    initialValue: data.parentCode,
                  })(<OrgTreeSelect mode="officeCode" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="机构名称">
                  {getFieldDecorator('officeName', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                    initialValue: data.officeName,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="机构代码">
                  {getFieldDecorator('officeCode', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                    initialValue: data.officeCode,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="机构全称">
                  {getFieldDecorator('fullName', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                    initialValue: data.fullName,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="排序号">
                  {getFieldDecorator('treeSort', {
                    initialValue: data.treeSort,
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="机构类型">
                  {getFieldDecorator('officeType', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                    initialValue: data.officeType,
                  })(
                    <Select allowClear>
                      <Option value="PROVINCIAL">省级公司</Option>
                      <Option value="CITY">市级公司</Option>
                      <Option value="NATIONAL">部门</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Form {...formItemLayout}>
            <p className={styles.addtit}>详细信息</p>
            <Divider />
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="负责人">
                  {getFieldDecorator('leader', { initialValue: data.leader })(
                    <Input />,
                  )}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="办公电话">
                  {getFieldDecorator('phone', { initialValue: data.phone })(
                    <Input allowClear />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="联系地址">
                  {getFieldDecorator('address', { initialValue: data.address })(
                    <Input allowClear />,
                  )}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="邮政编码">
                  {getFieldDecorator('zipCode', { initialValue: data.zipCode })(
                    <Input />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="电子邮箱">
                  {getFieldDecorator('email', { initialValue: data.email })(
                    <Input allowClear />,
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
                  {getFieldDecorator('remarks', { initialValue: data.remarks })(
                    <TextArea rows={4} />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Button
              type="primary"
              style={{ marginLeft: 200 }}
              onClick={this.submit}
            >
              保存
            </Button>
            <Button
              type="default"
              style={{ marginLeft: 10 }}
              onClick={this.handleClose}
            >
              关闭
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
export default connect()(Form.create()(OrganizeAdd));
