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
  message,
} from 'antd';
import { history } from 'umi';
import { get, post, put } from '@/utils/http';
import styles from './User.less';

const { Option } = Select;
const { TextArea, Search } = Input;

class UserFenPei extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    // this.fetch();
  }

  handleClose = () => {
    history.push('/admin/system/organ/userlist');
  };

  submit = () => {
    this.formRef.current.validateFields().then(values => {
      // const id = this.state.title === '编辑' ? this.props.match.params.id : null;
      // const newParams = { ...id, ...values };
      // post('sys-user-employees', newParams).then(res => {
      //   message.success(`${this.state.title}ok`);
      //   history.push('/admin/system/organ/userlist');
      //   // this.props.history.go(-1);
      //   console.log(values);
    });
  };

  render() {
    const { data } = this.state;
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
        dataIndex: 'roleName',
      },
      {
        title: '角色编码',
        dataIndex: 'roleCode',
      },
    ];

    return (
      <div className={styles.contentbox}>
        <div className={styles.header}>
          <span className={styles.tit}>用户分配角色</span>
        </div>
        <div className={styles.middle}>
          <Form {...formItemLayout} ref={this.formRef}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item
                  label="登录账号"
                  name="sysOfficeId"
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
                  initialValue={data.sysOfficeId}
                >
                  <Search allowClear />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="用户昵称"
                  name="sysCompanyId"
                  rules={[
                    {
                      required: true,
                      message: '必填!',
                    },
                  ]}
                  initialValue={data.sysCompanyId}
                >
                  <Search allowClear />
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
export default UserFenPei;
