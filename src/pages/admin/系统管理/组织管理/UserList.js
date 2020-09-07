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
  Tooltip,
  notification,
  Modal,
  message,
} from 'antd';
import { history } from 'umi';
import { del, get, put } from '@/utils/http';
import OrgTreeSelect from '@/components/OrgTreeSelect';
import CompanyTreeSelect from '@/components/CompanyTreeSelect';
import StationSelect from '@/components/StationSelect';
import { RightCircleOutlined } from '@ant-design/icons';
import styles from './User.less';
import TreeSideBar from '../../../../components/TreeSideBar';

const { confirm } = Modal;
const { Option } = Select;
const { Sider, Content } = Layout;
const { TreeNode } = TreeSelect;

class UserList extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.PageSize = 10;
    this.state = {
      data: [],
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
    get('sys/user-employees', newParams).then(res => {
      const { pagination } = this.state;
      if (Object.keys(params).length === 0 && pagination.current !== 0) {
        pagination.current = 0;
      }
      pagination.total = parseInt(res.headers['x-total-count'], 10);
      this.setState({
        loading: false,
        data: res.data,
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

  resetPassword = id => {
    put('sys/user-employees/reset-password', id).then(res => {
      message.success('操作成功');
    });
  };

  showDeleteConfirm = id => {
    const that = this;
    confirm({
      title: '信息',
      content: '确认要删除该用户吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        del(`sys/user-employees/delete/${id}`).then(res => {
          that.fetch();
          notification.success({
            message: '删除成功',
          });
        });
      },
    });
  };

  tyConfirm = userId => {
    const that = this;
    confirm({
      title: '停用',
      content: '确认要停用该用户吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        put('sys/user-employees/disable', userId).then(res => {
          that.fetch();
          notification.success({
            message: '停用成功',
          });
        });
      },
    });
  };

  qyConfirm = userId => {
    const that = this;
    confirm({
      title: '启用',
      content: '确认要启用该用户吗?',
      okText: '确认',
      okType: 'success',
      cancelText: '取消',
      onOk() {
        put('sys/user-employees/enable', userId).then(res => {
          that.fetch();
          notification.success({
            message: '启用成功',
          });
        });
      },
    });
  };

  clickSideBar = val => {
    // sideBar组织机构点击事件
    this.formRef.current.setFieldsValue({ sysOfficeId: val }, this.fetch); // callback func
  };

  render() {
    const columns = [
      {
        title: '登录账号',
        dataIndex: 'userInfo.loginCode',
      },
      {
        title: '用户昵称',
        dataIndex: 'userInfo.userName',
      },
      {
        title: '员工姓名',
        dataIndex: 'empName',
      },
      {
        title: '归属机构',
        dataIndex: 'officeInfo.officeName',
      },
      {
        title: '归属公司',
        dataIndex: 'companyInfo.companyName',
      },
      {
        title: '电子邮箱',
        dataIndex: 'userInfo.email',
      },
      {
        title: '手机号码',
        dataIndex: 'userInfo.mobile',
      },
      {
        title: '办公电话',
        dataIndex: 'userInfo.phone',
      },
      {
        title: '状态',
        dataIndex: 'userInfo.status',
        render: text => {
          let color = '';
          let t = '';
          switch (text) {
            case 'NORMAL':
              color = 'blue';
              t = '正常';
              break;
            case 'DISABLE':
              color = 'red';
              t = '禁用';
              break;
            default:
              break;
          }
          return <Tag color={color}>{t}</Tag>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operator',
        render: (text, record) => {
          let tt = (
            <div>
              {/*<Tooltip title='用户分配角色'>*/}
              {/*  <Tag*/}
              {/*    onClick={() => {*/}
              {/*      history.push('/admin/system/organ/userfenpei')*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    分配角色*/}
              {/*  </Tag>*/}
              {/*</Tooltip>*/}
              {/*<Tooltip title='用户分配数据权限'>*/}
              {/*  <Tag*/}
              {/*    onClick={() => {*/}
              {/*      history.push('/admin/system/organ/userShuJu')*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    数据权限*/}
              {/*  </Tag>*/}
              {/*</Tooltip>*/}
              <Tooltip title="用户密码重置">
                <Tag
                  onClick={() => {
                    this.resetPassword(record.id);
                  }}
                >
                  重置密码
                </Tag>
              </Tooltip>
            </div>
          );
          const gd_bt = (
            <Tooltip placement="top" title={tt}>
              <Button type="link" style={{ paddingLeft: 0 }}>
                <RightCircleOutlined style={{ color: 'blue' }} />
              </Button>
            </Tooltip>
          );
          const bj_bt = (
            <Tooltip placement="top" title="编辑用户">
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  history.push({
                    pathname: `/admin/system/organ/useredit/${record.id}`,
                  });
                }}
              >
                <Icon type="edit" style={{ color: 'green' }} />
              </Button>
            </Tooltip>
          );
          const ty_bt =
            record.userInfo.status === 'NORMAL' ? (
              <Tooltip placement="top" title="停用用户">
                <Button
                  type="link"
                  style={{ paddingLeft: 0 }}
                  onClick={() => this.tyConfirm(record.id)}
                >
                  <Icon type="stop" style={{ color: 'red' }} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip placement="top" title="启用用户">
                <Button
                  type="link"
                  style={{ paddingLeft: 0 }}
                  onClick={() => this.qyConfirm(record.id)}
                >
                  <Icon type="check-circle" style={{ color: 'green' }} />
                </Button>
              </Tooltip>
            );
          const del_bt = (
            <Tooltip placement="top" title="删除用户">
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  this.showDeleteConfirm(record.id);
                }}
              >
                <Icon type="delete" style={{ color: 'red' }} />
              </Button>
            </Tooltip>
          );
          return (
            <span>
              {bj_bt}
              {ty_bt}
              {del_bt}
              {gd_bt}
            </span>
          );
        },
      },
    ];
    return (
      <Layout>
        <TreeSideBar onSelect={this.clickSideBar} {...this.props} />
        <Content className={styles.contentbox}>
          <div className={styles.header}>
            <span className={styles.tit}>用户管理</span>
            <Button className={styles.addBtn} onClick={this.handleShow}>
              {this.state.Show}
            </Button>
            <Button
              type="default"
              className={styles.addBtn}
              onClick={() => {
                history.push('/admin/system/organ/useradd'); // 跳转方式 2
              }}
            >
              <Icon type="plus" />
              新增
            </Button>
          </div>
          <div className={styles.rightDiv}>
            <Form
              layout="inline"
              style={{ display: this.state.isShow }}
              ref={this.formRef}
            >
              <Form.Item label="帐号" name="user.loginCode">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="昵称" name="user.userName">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="邮箱" name="user.email">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="手机" name="user.mobile">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="电话" name="user.phone">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="姓名" name="empName">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="机构" name="office.id">
                <OrgTreeSelect mode="id" />
              </Form.Item>
              <Form.Item label="公司" name="company.id">
                <CompanyTreeSelect mode="id" />
              </Form.Item>
              <Form.Item label="岗位" name="postList.id">
                <StationSelect />
              </Form.Item>
              <Form.Item label="状态" name="user.status">
                <Select allowClear>
                  <Option value="NORMAL">正常</Option>
                  <Option value="DISABLE" style={{ color: 'red' }}>
                    停用
                  </Option>
                  {/* <Option value='冻结' style={{ color: '#FFCC00' }}> */}
                  {/*  冻结 */}
                  {/* </Option> */}
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

            <div>
              <Table
                dataSource={this.state.data}
                columns={columns}
                rowKey={record => record.id}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
              />
            </div>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default UserList;
