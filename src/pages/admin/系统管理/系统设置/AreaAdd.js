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
  Radio,
  Checkbox,
} from 'antd';
import { get } from '@/utils/http';
import { connect, history } from 'umi';
import styles from './Area.less';

const { Option } = Select;
const { TextArea, Search } = Input;

class AreaAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.formRef = React.createRef();
  }

  componentDidMount() {
    // this.fetch();
  }

  handleClose = () => {
    this.props.dispatch({
      type: 'routerTabs/closePage',
      payload: { closePath: this.props.location.pathname },
    });
    history.goBack();
  };

  submit = async () => {
    let queryConditions = await this.formRef.current.validateFields();
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
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
        <div className={styles.header}>
          <span className={styles.tit}>新增区域</span>
        </div>
        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Form ref={this.formRef} {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label="上级区域：" name="sjqy">
                  <Search allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item
                  label="区域代码："
                  name="qydm"
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item
                  label="区域名称："
                  name="qymc"
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item
                  label="区域类型："
                  wrapperCol={{ span: 19 }}
                  labelCol={{ span: 3 }}
                  name="qylx"
                >
                  <Radio.Group
                    onChange={this.onChange}
                    value={this.state.value}
                  >
                    <Radio value={1}>国家</Radio>
                    <Radio value={2}>省份直辖市</Radio>
                    <Radio value={3}>地市</Radio>
                    <Radio value={4}>区县</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item
                  label="排序号："
                  name="px"
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item
                  label="备注信息："
                  wrapperCol={{ span: 19 }}
                  labelCol={{ span: 3 }}
                  name="bz"
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Divider />
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
      </div>
    );
  }
}
export default connect()(AreaAdd);
