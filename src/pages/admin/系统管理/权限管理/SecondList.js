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
  Form,
  Button,
  DatePicker,
  Divider,
  Input,
  Layout,
  TreeSelect,
  Select,
  Table,
  Tag,
  Cascader,
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { get } from '@/utils/http';
import SecondAdd from '@/pages/admin/系统管理/权限管理/SecondAdd';
import styles from './Second.less';

const { Option } = Select;
const { Sider, Content } = Layout;

class SecondList extends Component {
  constructor(props) {
    super(props);
    this.PageSize = 10;
    this.state = {
      dataSource: [],
      loading: false,
      pagination: { current: 0, pageSize: this.PageSize },
      isShow: 'block',
      Show: '隐藏',
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    // this.fetch();
  }

  handleShow = () => {
    this.state.Show === '隐藏'
      ? this.setState({ isShow: 'none', Show: '查询' })
      : this.setState({ isShow: 'block', Show: '隐藏' });
  };

  fetch = async (params = {}) => {
    let queryConditions = await this.formRef.validateFields();
    this.setState({ loading: true });
    const { pagination } = this.state;
    if (Object.keys(params).length === 0 && pagination.current !== 0) {
      pagination.current = 0;
      this.setState(pagination);
    }
    const newParams = { size: this.PageSize, ...params, ...queryConditions };
    get('t-customer-changes', newParams).then(res => {
      pagination.total = parseInt(res.headers['x-total-count'], 10);
      this.setState({
        loading: false,
        dataSource: res.data,
        pagination,
      });
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current - 1;
    this.setState({ pagination });
    this.fetch({
      page: pager.current,
      ...filters,
    });
  };

  render() {
    const columns = [
      {
        title: '登录账号',
        dataIndex: 'dlzh',
      },
      {
        title: '用户昵称',
        dataIndex: 'yhnc',
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
      },
      {
        title: '手机号码',
        dataIndex: 'mobilephone',
      },
      {
        title: '办公电话',
        dataIndex: 'call',
      },
      {
        title: '更新时间',
        dataIndex: 'updatetime',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '操作',
        dataIndex: 'operator',
      },
    ];

    return (
      <Layout>
        <Content className={styles.contentbox}>
          <div className={styles.header}>
            <span className={styles.tit}>二级管理员</span>
            <Button className={styles.addBtn} onClick={this.handleShow}>
              <SearchOutlined />
              {this.state.Show}
            </Button>
            <Button
              type="default"
              className={styles.addBtn}
              onClick={() => {
                history.push('/admin/system/limit/secondadd'); // 跳转方式 2
              }}
            >
              <PlusOutlined />
              新增
            </Button>
          </div>
          <div className={styles.rightDiv}>
            <Form
              ref={this.formRef}
              layout="inline"
              style={{ display: this.state.isShow }}
            >
              <Form.Item label="账号：" name="zh">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="昵称：" name="nc">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="邮箱：" name="email">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="手机：" name="mobilephone">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="电话：" name="call">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="状态" name="status">
                <Select allowClear>
                  <Option value="正常">正常</Option>
                  <Option value="停用" style={{ color: 'red' }}>
                    停用
                  </Option>
                  <Option value="冻结" style={{ color: '#FFCC00' }}>
                    停用
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={() => {
                    this.fetch();
                  }}
                >
                  查询
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    this.props.form.resetFields();
                  }}
                >
                  重置
                </Button>
              </Form.Item>
              <Divider dashed="true" />
            </Form>
            <Table
              dataSource={this.state.dataSource}
              columns={columns}
              rowKey={record => record.id}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
            />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default SecondList;
