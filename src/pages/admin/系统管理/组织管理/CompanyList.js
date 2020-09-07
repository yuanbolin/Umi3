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
  Modal,
  Divider,
  Input,
  Layout,
  TreeSelect,
  Select,
  Table,
  Tag,
  Tooltip,
  notification,
} from 'antd';
import { history } from 'umi';
import { del, get, put } from '@/utils/http';
import CompanyTreeSelect from '@/components/CompanyTreeSelect';
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UpOutlined,
  DownOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import styles from './Company.less';

const { Option } = Select;
const { confirm } = Modal;
const { TreeNode } = TreeSelect;

class CompanyList extends Component {
  formRef = React.createRef();

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
  }

  componentDidMount() {
    this.fetch();
  }

  handleShow = () => {
    this.state.Show === '隐藏'
      ? this.setState({ isShow: 'none', Show: '查询' })
      : this.setState({ isShow: 'block', Show: '隐藏' });
  };

  fetch = async (params = {}) => {
    let queryConditions = await this.formRef.current.validateFields();
    this.setState({ loading: true });
    const newParams = {
      page: 0,
      size: this.PageSize,
      ...params,
      ...queryConditions,
    };
    get('sys-companys', newParams).then(res => {
      const { pagination } = this.state;
      if (Object.keys(params).length === 0 && pagination.current !== 0) {
        pagination.current = 0;
      }
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

  showDeleteConfirm = companyCode => {
    const the = this;
    confirm({
      title: '信息',
      content: '确认要删除该公司（及其下属公司）吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        del(`sys-companys/${companyCode}`).then(res => {
          the.fetch();
          notification.success({ message: '删除成功' });
        });
      },
    });
  };

  tyConfirm = record => {
    const that = this;
    confirm({
      title: '停用',
      content: '确认要停用该公司吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const obj = Object.assign({}, record.sysCompany);
        obj.status = 'DISABLE';
        put('sys-companys', obj).then(res => {
          that.fetch();
          notification.success({
            message: '停用成功',
          });
        });
      },
    });
  };

  qyConfirm = record => {
    const that = this;
    confirm({
      title: '启用',
      content: '确认要启用该公司吗?',
      okText: '确认',
      okType: 'success',
      cancelText: '取消',
      onOk() {
        const obj = Object.assign({}, record.sysCompany);
        obj.status = 'NORMAL';
        put('sys-companys', obj).then(res => {
          that.fetch();
          notification.success({
            message: '启用成功',
          });
        });
      },
    });
  };

  refresh = () => {
    this.setState({ dataSource: [] });
    this.fetch();
  };

  render() {
    const columns = [
      {
        title: '公司名称',
        dataIndex: 'sysCompany.companyName',
      },
      {
        title: '公司全称',
        dataIndex: 'sysCompany.fullName',
      },
      {
        title: '排序号',
        dataIndex: 'sysCompany.treeSort',
      },
      {
        title: '归属区域',
        dataIndex: 'sysCompany.areaCode',
      },
      {
        title: '备注信息',
        dataIndex: 'sysCompany.remarks',
      },
      {
        title: '状态',
        dataIndex: 'sysCompany.status',
        render: text => {
          if (text === 'NORMAL') return <Tag color="blue">正常</Tag>;
          if (text === 'DISABLE') return <Tag color="red">停用</Tag>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operator',
        render: (text, record) => {
          const bj_bt = (
            <Tooltip placement="top" title="编辑公司">
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  history.push({
                    pathname: `/admin/system/organ/companyedit/${record.sysCompany.id}`,
                    state: record,
                  });
                }}
              >
                <EditOutlined style={{ color: 'green' }} />
              </Button>
            </Tooltip>
          );
          const del_bt = (
            <Tooltip placement="top" title="删除公司">
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  this.showDeleteConfirm(record.sysCompany.companyCode);
                }}
              >
                <DeleteOutlined style={{ color: 'red' }} />
              </Button>
            </Tooltip>
          );
          const ty_bt =
            record.sysCompany.status === 'NORMAL' ? (
              <Tooltip placement="top" title="停用公司">
                <Button
                  type="link"
                  style={{ paddingLeft: 0 }}
                  onClick={() => this.tyConfirm(record)}
                >
                  <StopOutlined style={{ color: 'red' }} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip placement="top" title="启用公司">
                <Button
                  type="link"
                  style={{ paddingLeft: 0 }}
                  onClick={() => this.qyConfirm(record)}
                >
                  <CheckCircleOutlined style={{ color: 'green' }} />
                </Button>
              </Tooltip>
            );
          const add_bt = (
            <Tooltip placement="top" title="新增下级公司">
              <Button type="link" style={{ paddingLeft: 0 }}>
                <PlusOutlined />
              </Button>
            </Tooltip>
          );
          return (
            <span>
              {bj_bt}
              {ty_bt}
              {del_bt}
            </span>
          );
        },
      },
    ];
    const { dataSource } = this.state;

    return (
      <div className={styles.contentbox}>
        <div className={styles.header}>
          <span className={styles.tit}>公司管理</span>
          <Button className={styles.addBtn} onClick={this.handleShow}>
            <SearchOutlined />
            {this.state.Show}
          </Button>
          <Button
            type="default"
            className={styles.addBtn}
            onClick={() => {
              history.push('/admin/system/organ/companyadd'); // 跳转方式 2
            }}
          >
            <PlusOutlined />
            新增
          </Button>
          <Button type="default" className={styles.addBtn}>
            <UpOutlined />
            折叠
          </Button>
          <Button type="default" className={styles.addBtn}>
            <DownOutlined />
            展开
          </Button>
          <Button
            type="default"
            className={styles.addBtn}
            onClick={
              this.refresh
              // window.location.reload(); // 刷新
            }
          >
            <SyncOutlined />
            刷新
          </Button>
        </div>
        <div className={styles.rightDiv}>
          <Form
            layout="inline"
            style={{ display: this.state.isShow }}
            ref={this.formRef}
          >
            <Form.Item label="公司名称" name="companyName">
              <CompanyTreeSelect mode="companyName" />
            </Form.Item>
            <Form.Item label="公司代码" name="companyCode">
              <Input allowClear />
            </Form.Item>
            <Form.Item label="公司全称" name="fullName">
              <Input allowClear />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Select allowClear>
                <Option value="NORMAL">正常</Option>
                <Option value="DISABLE" style={{ color: 'red' }}>
                  停用
                </Option>
              </Select>
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
            expandRowByClick
            rowKey={record => record.sysCompany.id}
            pagination={this.state.pagination}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}

export default CompanyList;
