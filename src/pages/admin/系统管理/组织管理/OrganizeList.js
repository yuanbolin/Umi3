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
  Divider,
  Input,
  Layout,
  Select,
  Table,
  Tag,
  Tooltip,
  notification,
  Modal,
} from 'antd';
import { history } from 'umi';
import { del, get, put } from '@/utils/http';
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import TreeSideBar from '../../../../components/TreeSideBar';
import styles from './Organize.less';

const { Option } = Select;
const { Sider, Content } = Layout;
const { confirm } = Modal;

class OrganizeList extends Component {
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
      defaultExpandAllRows: false, //默认展开全部行 配合tableKey 使用
    };
  }

  componentDidMount() {
    const initValForm = sessionStorage.getItem(`${this.props.match.url}-form`);
    const initValState = sessionStorage.getItem(
      `${this.props.match.url}-state`,
    );
    if (initValForm) {
      this.formRef.current.setFieldsValue(JSON.parse(initValForm));
    }
    if (initValState) {
      this.setState({ ...JSON.parse(initValState) });
    } else {
      this.fetch();
    }
  }

  componentWillUnmount() {
    if (sessionStorage.getItem(`${this.props.match.url}-close`) === 'false') {
      sessionStorage.setItem(
        `${this.props.match.url}-form`,
        JSON.stringify(this.formRef.current.getFieldsValue()),
      );
      sessionStorage.setItem(
        `${this.props.match.url}-state`,
        JSON.stringify(this.state),
      );
    } else {
      sessionStorage.removeItem(`${this.props.match.url}-form`);
      sessionStorage.removeItem(`${this.props.match.url}-state`);
    }
  }

  handleShow = () => {
    this.state.Show === '隐藏'
      ? this.setState({ isShow: 'none', Show: '查询' })
      : this.setState({ isShow: 'block', Show: '隐藏' });
  };

  expandRows = isExpand => {
    // 折叠
    this.setState(prevState => ({ defaultExpandAllRows: isExpand }));
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
    get('sys-offices', newParams).then(res => {
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

  showDeleteConfirm = officeCode => {
    const that = this;
    confirm({
      title: '信息',
      content: '删除机构将一并删除所有下属子机构，确定吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        del(`sys-offices/${officeCode}`).then(res => {
          that.fetch();
          notification.success({ message: '删除成功' });
        });
      },
    });
  };

  tyConfirm = record => {
    const that = this;
    confirm({
      title: '停用',
      content: '确认要停用该机构吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const obj = Object.assign({}, record.sysOffice);
        obj.status = 'DISABLE';
        put('sys-offices', obj).then(res => {
          notification.success({
            message: '停用成功',
          });
          that.fetch();
        });
      },
    });
  };

  qyConfirm = record => {
    const that = this;
    confirm({
      title: '启用',
      content: '确认要启用该机构吗?',
      okText: '确认',
      okType: 'success',
      cancelText: '取消',
      onOk() {
        const obj = Object.assign({}, record.sysOffice);
        obj.status = 'NORMAL';
        put('sys-offices', obj).then(res => {
          notification.success({
            message: '启用成功',
          });
          that.fetch();
        });
      },
    });
  };

  onSelectTreeSideBar = val => {
    this.fetch({ officeId: val });
  };

  render() {
    const { dataSource } = this.state;
    const columns = [
      {
        title: '机构名称',
        dataIndex: 'sysOffice.officeName',
      },
      {
        title: '机构全称',
        dataIndex: 'sysOffice.fullName',
      },
      {
        title: '排序号',
        dataIndex: 'sysOffice.treeSort',
      },
      {
        title: '机构类型',
        dataIndex: 'sysOffice.officeType',
        render: text => {
          if (text === 'NATIONAL') return '部门';
          if (text === 'PROVINCIAL') return '省级公司';
          if (text === 'CITY') return '市级公司';
        },
      },
      {
        title: '备注信息',
        dataIndex: 'sysOffice.remarks',
      },
      {
        title: '状态',
        dataIndex: 'sysOffice.status',
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
            <Tooltip placement="top" title="编辑机构">
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  history.push({
                    pathname: `/admin/system/organ/Organizeedit/${record.sysOffice.id}`,
                    state: record,
                  });
                }}
              >
                <EditOutlined style={{ color: 'green' }} />
              </Button>
            </Tooltip>
          );
          const del_bt = (
            <Tooltip placement="top" title="删除机构">
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  this.showDeleteConfirm(record.sysOffice.officeCode);
                }}
              >
                <DeleteOutlined style={{ color: 'red' }} />
              </Button>
            </Tooltip>
          );
          const ty_bt =
            record.sysOffice.status === 'NORMAL' ? (
              <Tooltip placement="top" title="停用">
                <Button
                  type="link"
                  style={{ paddingLeft: 0 }}
                  onClick={() => this.tyConfirm(record)}
                >
                  <StopOutlined style={{ color: 'red' }} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip placement="top" title="启用">
                <Button
                  type="link"
                  style={{ paddingLeft: 0 }}
                  onClick={() => this.qyConfirm(record)}
                >
                  <CheckCircleOutlined style={{ color: 'green' }} />
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

    return (
      <Layout>
        <TreeSideBar onSelect={this.onSelectTreeSideBar} {...this.props} />
        <Content className={styles.contentbox}>
          <div className={styles.header}>
            <span className={styles.tit}>机构管理</span>
            <Button className={styles.addBtn} onClick={this.handleShow}>
              {this.state.Show}
            </Button>
            <Button
              type="default"
              className={styles.addBtn}
              onClick={() => {
                history.push('/admin/system/organ/organizeadd'); // 新增
              }}
            >
              <PlusOutlined />
              新增
            </Button>
            <Button
              type="default"
              className={styles.addBtn}
              onClick={() => {
                this.expandRows(false);
              }}
            >
              <UpOutlined />
              折叠
            </Button>
            <Button
              type="default"
              className={styles.addBtn}
              onClick={() => {
                this.expandRows(true);
              }}
            >
              <DownOutlined />
              展开
            </Button>
            <Button
              type="default"
              className={styles.addBtn}
              onClick={this.fetch}
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
              <Form.Item label="机构名称" name="officeName">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="机构代码" name="officeCode">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="机构全称" name="fullName">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="机构类型" name="officeType">
                <Select allowClear>
                  <Option value="PROVINCIAL">省级公司</Option>
                  <Option value="CITY">市级公司</Option>
                  <Option value="NATIONAL">部门</Option>
                </Select>
                ,
              </Form.Item>
              <Form.Item label="状态" name="status">
                <Select allowClear>
                  <Option value="NORMAL">正常</Option>
                  <Option value="DISABLE" style={{ color: 'red' }}>
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
                    this.formRef.current.resetFields();
                  }}
                >
                  重置
                </Button>
              </Form.Item>
              <Divider dashed="true" />
            </Form>
            <Table
              key={this.state.defaultExpandAllRows}
              defaultExpandAllRows={this.state.defaultExpandAllRows}
              dataSource={dataSource}
              columns={columns}
              expandRowByClick
              rowKey={record => record.sysOffice.id}
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

export default OrganizeList;
