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
  Select,
  Table,
  Modal,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { get } from '@/utils/http';
import ModalOperator from '@/pages/admin/系统管理/系统监控/ModalOperator';
import styles from './Log.less';

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const { Sider, Content } = Layout;
class LogList extends Component {
  constructor(props) {
    super(props);
    this.PageSize = 10;
    this.state = {
      dataSource: [],
      loading: false,
      pagination: { current: 0, pageSize: this.PageSize },
      isShow: 'block',
      Show: '隐藏',
      handleModal: false,
      searchValue: '',
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
    let queryConditions = await this.formRef.current.validateFields();
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

  handleModal = () => {
    this.setState({
      handleModal: false,
    });
  };

  handleValue = n => {
    this.formRef.current.setFieldsValue({ czyh: n });
    this.setState({
      searchValue: n,
    });
  };

  render() {
    const columns = [
      {
        title: '日志标题',
        dataIndex: 'rzbt',
      },
      {
        title: '请求地址',
        dataIndex: 'qqdz',
      },
      {
        title: '日志类型',
        dataIndex: 'rzlx',
      },
      {
        title: '操作用户',
        dataIndex: 'czyh',
      },
      {
        title: '异常',
        dataIndex: 'yc',
      },
      {
        title: '业务类型',
        dataIndex: 'ywlx',
      },
      {
        title: '业务主键',
        dataIndex: 'ywzj',
      },
      {
        title: '客户端IP',
        dataIndex: 'khdip',
      },
      {
        title: '操作时间',
        dataIndex: 'czsj',
      },
      {
        title: '设备名称',
        dataIndex: 'sbmc',
      },
      {
        title: '浏览器名',
        dataIndex: 'llqm',
      },
      {
        title: '响应时间',
        dataIndex: 'xysj',
      },
    ];

    return (
      <Layout>
        <Content className={styles.contentbox}>
          <div className={styles.header}>
            <span className={styles.tit}>访问日志查询</span>
            <Button className={styles.addBtn} onClick={this.handleShow}>
              <SearchOutlined />
              {this.state.Show}
            </Button>
          </div>
          <div className={styles.rightDiv}>
            <Form
              ref={this.formRef}
              layout="inline"
              style={{ display: this.state.isShow }}
            >
              <Form.Item label="日志标题：" name="rzbt">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="请求地址：" name="qqdz">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="日志类型" name="rzlx">
                <Select allowClear>
                  <Option value="00">接入日志</Option>
                  <Option value="01">修改日志</Option>
                  <Option value="02">查询日志</Option>
                  <Option value="03">登录登出</Option>
                </Select>
              </Form.Item>
              <Form.Item label="操作用户：" name="czyh">
                <Search
                  allowClear
                  onSearch={() => this.setState({ handleModal: true })}
                />
              </Form.Item>
              <Form.Item label="是否异常" name="sfyc">
                <Select allowClear>
                  <Option value="00">是</Option>
                  <Option value="01" style={{ color: '#C0C0C0' }}>
                    否
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item label="业务类型：" name="ywlx">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="业务主键：" name="ywzj">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="客户端IP：" name="khdip">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="操作时间：" name="czsj">
                <RangePicker allowClear />
              </Form.Item>
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
                  this.formRef.current.resetFields();
                }}
              >
                重置
              </Button>
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
        {this.state.handleModal === true ? (
          <ModalOperator
            handleModal={this.state.handleModal}
            onChange={this.handleModal}
            handleValue={this.handleValue}
          />
        ) : null}
      </Layout>
    );
  }
}

export default LogList;
