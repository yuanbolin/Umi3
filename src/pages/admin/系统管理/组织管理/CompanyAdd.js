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
import CompanyTreeSelect from '@/components/CompanyTreeSelect';
import OrgTreeSelect from '@/components/OrgTreeSelect';
import styles from './Company.less';

const { Option } = Select;
const { TextArea, Search } = Input;

class CompanyAdd extends Component {
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
    get(`sys-companys/${this.props.match.params.id}`).then(res => {
      this.setState({ data: res.data });
    });
  };

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false;
      if (this.pageType === 'edit') {
        const id = this.props.match.params.id;
        const newParams = { id, ...this.state.data, ...values };
        put('sys-companys', newParams).then(res => {
          message.success(`编辑成功`);
        });
      } else {
        const newParams = { ...values };
        post('sys-companys', newParams).then(res => {
          message.success(`新增成功`);
        });
      }
    });
  };

  handleClose = () => {
    this.props.dispatch({
      type: 'routerTabs/closePage',
      payload: { closePath: this.props.location.pathname },
    });
    history.goBack();
  };

  render() {
    const { data } = this.state;
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
        {/*  <span className={styles.tit}>{this.state.title}公司</span> */}
        {/* </div> */}
        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Form {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item
                  label="上级公司"
                  name="parentCode"
                  initialValue={data.parentCode}
                >
                  <CompanyTreeSelect mode="companyCode" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="状态"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
                  initialValue={data.status}
                >
                  <Select allowClear>
                    <Option value="NORMAL">正常</Option>
                    <Option value="DISABLE" style={{ color: 'red' }}>
                      停用
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item
                  label="公司名称"
                  name="companyName"
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
                  initialValue={data.companyName}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="公司编码"
                  name="companyCode"
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
                  initialValue={data.companyCode}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item
                  label="公司全称"
                  name="fullName"
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
                  initialValue={data.fullName}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="排序号"
                  name="treeSort"
                  initialValue={data.treeSort}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item
                  label="归属区域"
                  name="areaCode"
                  initialValue={data.areaCode}
                >
                  <Search allowClear />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="包含机构"
                  name="sysOfficeIds"
                  initialValue={data.sysOfficeIds}
                >
                  <OrgTreeSelect mode="id" treeCheckable />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item
                  label="备注信息"
                  wrapperCol={{ span: 19 }}
                  labelCol={{ span: 3 }}
                  name="remarks"
                  initialValue={data.remarks}
                >
                  <TextArea rows={4} allowClear />,
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Divider />
          <Button
            type="primary"
            style={{ marginLeft: 130 }}
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
      </div>
    );
  }
}
export default connect()(CompanyAdd);
