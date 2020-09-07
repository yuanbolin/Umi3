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
import styles from './Station.less';

const { Option } = Select;
const { TextArea } = Input;

class StationAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
    this.formRef = React.createRef();
    this.pageType = this.props.match.params.id ? 'edit' : 'add'; // 判断页面是编辑还是新增
  }

  componentDidMount() {
    if (this.pageType === 'edit') this.getDetail();
  }

  getDetail = () => {
    get(`sys-posts/${this.props.match.params.id}`).then(res => {
      this.setState({ data: res.data });
    });
  };

  handleClose = () => {
    // 关闭tabs标签
    this.props.dispatch({
      type: 'routerTabs/closePage',
      payload: { closePath: this.props.location.pathname },
    });
    history.goBack();
  };

  submit = values => {
    console.log(values);
    if (this.pageType === 'edit') {
      const id = this.props.match.params.id;
      const newParams = { id, ...values };
      put('sys-posts', newParams).then(res => {
        message.success(`编辑ok`);
        this.props.history.go(-1);
      });
    } else {
      const newParams = { ...values };
      post('sys-posts', newParams).then(res => {
        message.success(`新增ok`);
        this.props.history.go(-1);
      });
    }
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
        {/*  <span className={styles.tit}>{this.state.title}岗位</span> */}
        {/* </div> */}

        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Form ref={this.formRef} {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item
                  label="岗位名称"
                  name="postName"
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
                  initialValue={data.postName}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="岗位编码"
                  name="postCode"
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
                  initialValue={data.postCode}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
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
              <Col span={10}>
                <Form.Item
                  label="岗位分类"
                  name="postType"
                  initialValue={data.postType}
                >
                  <Select allowClear>
                    <Option value="SENIOR">高管</Option>
                    <Option value="MIDDLE">中层</Option>
                    <Option value="BASIC">基层</Option>
                  </Select>
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
                  <TextArea rows={4} />
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
export default connect()(StationAdd);
