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
  Radio,
  Checkbox,
} from 'antd';
import { get } from '@/utils/http';
import { connect, history } from 'umi';
import styles from './Dict.less';

const { Option } = Select;
const { TextArea, Search } = Input;

class DictAdd extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
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

  submit = () => {
    this.formRef.current.validateFields().then(values => {
      console.log(values);
    });
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
          <span className={styles.tit}>新增字典类型</span>
        </div>
        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Form {...formItemLayout} ref={this.formRef}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item
                  label="字典名称："
                  name="zdmc"
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
                  label="字典类型："
                  name="zdlx"
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
                <Form.Item label="是否系统：" name="sfxt">
                  <Radio.Group
                    onChange={this.onChange}
                    value={this.state.value}
                  >
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </Radio.Group>
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
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
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
export default connect()(DictAdd);
