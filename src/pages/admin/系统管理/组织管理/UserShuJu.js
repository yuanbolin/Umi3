/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react';
import { Button, Col, Divider, Input, Row, Select, Form, Icon, Table, DatePicker, Modal, message, Tree } from 'antd';
import {history} from 'umi';
import { get, post, put } from '@/utils/http';
import styles from './User.less';

const { Option } = Select;
const { TextArea, Search } = Input;

class UserShuJu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      orgTree: [],
      companyTree: [],
    };
  }

  componentDidMount() {
    // this.fetch();
    this.getOrgTree();
    this.getCompanyTree();
  }

  handleClose = () => {
    history.push('/admin/system/organ/userlist');
  };

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false;
      // const id = this.state.title === '编辑' ? this.props.match.params.id : null;
      // const newParams = { ...id, ...values };
      // post('sys-user-employees', newParams).then(res => {
      //   message.success(`${this.state.title}ok`);
      //   history.push('/admin/system/organ/userlist');
      //   // this.props.history.go(-1);
      //   console.log(values);
    });
  };

  getOrgTree = () => {
    get('sys-offices/tree').then(res => {
      this.setState({
        orgTree: res.data,
      });
    });
  };

  getCompanyTree = () => {
    get('sys-companys/tree').then(res => {
      this.setState({
        companyTree: res.data,
      });
    });
  };

  render() {
    const { data } = this.state;
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
        <div className={styles.header}>
          <span className={styles.tit}>用户分配数据权限</span>
        </div>
        <div className={styles.middle}>
          <Form {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='登录账号'>
                  {getFieldDecorator('sysOfficeId', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                    initialValue: data.sysOfficeId,
                  })(<Search allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='用户昵称'>
                  {getFieldDecorator('sysCompanyId', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                    initialValue: data.sysCompanyId,
                  })(<Search allowClear />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <p className={styles.addtit}>数据权限</p>
          <Divider />
          <Tree
            checkable
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
            treeData={this.state.orgTree}
          />
          <Tree
            checkable
            onExpand={this.onExpand}
            expandedKeys={this.state.expandedKeys}
            autoExpandParent={this.state.autoExpandParent}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            onSelect={this.onSelect}
            selectedKeys={this.state.selectedKeys}
            treeData={this.state.companyTree}
          />
          <Divider />
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
export default Form.create()(UserShuJu);
