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
import { UserOutlined, LoadingOutlined, LockOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { del, get, put } from '@/utils/http';
import styles from './Role.less';

const { confirm } = Modal;
const { Option } = Select;
const { Sider, Content } = Layout;

class RoleList extends Component {
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
    this.fetch();
  }

  handleShow = () => {
    this.state.Show === '隐藏'
      ? this.setState({ isShow: 'none', Show: '查询' })
      : this.setState({ isShow: 'block', Show: '隐藏' });
  };

  fetch = async (params = {}) => {
    let queryConditions = await this.formRef.validateFields();
    this.setState({ loading: true });
    const newParams = {
      page: 0,
      size: this.PageSize,
      ...params,
      ...queryConditions,
    };
    get('sys-roles', newParams).then(res => {
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

  tyConfirm = record => {
    const that = this;
    confirm({
      title: '停用',
      content: '确认要停用该角色吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const obj = Object.assign({}, record);
        obj.status = 'DISABLE';
        put('sys-roles', obj).then(res => {
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
      content: '确认要启用该角色吗?',
      okText: '确认',
      okType: 'success',
      cancelText: '取消',
      onOk() {
        const obj = Object.assign({}, record);
        obj.status = 'NORMAL';
        put('sys-roles', obj).then(res => {
          that.fetch();
          notification.success({
            message: '启用成功',
          });
        });
      },
    });
  };

  showDeleteConfirm = id => {
    const that = this;
    confirm({
      title: '信息',
      content: '确认要删除该角色吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        del(`sys-roles/${id}`).then(res => {
          notification.success({ message: '删除成功' });
          that.fetch();
        });
      },
    });
  };

  render() {
    const columns = [
      {
        title: '角色名称',
        align: 'center',
        dataIndex: 'roleName',
      },
      {
        title: '角色编码',
        align: 'center',
        dataIndex: 'roleCode',
      },
      {
        title: '排序号',
        align: 'center',
        dataIndex: 'roleSort',
      },
      {
        title: '系统角色',
        align: 'center',
        dataIndex: 'isSys',
        render: text => {
          if (text === true) return '是';
          if (text === false) return '否';
        },
      },
      {
        title: '用户类型',
        align: 'center',
        dataIndex: 'roleType',
        render: text => {
          if (text === 'USER') return '员工';
          if (text === 'ORGANIZARION') return '组织';
        },
      },
      {
        title: '备注信息',
        align: 'center',
        dataIndex: 'remarks',
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: 'status',
        render: text => {
          if (text === 'NORMAL') return <Tag color="blue">正常</Tag>;
          if (text === 'DISABLE') return <Tag color="red">停用</Tag>;
        },
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'operator',
        render: (text, record) => {
          const bj_bt = (
            <Tooltip placement="top" title="编辑角色">
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  history.push({
                    pathname: `/admin/system/limit/roleedit/${record.id}`,
                    state: record,
                  });
                }}
              >
                <EditOutlined type="edit" style={{ color: 'green' }} />
              </Button>
            </Tooltip>
          );
          const del_bt = (
            <Tooltip placement="top" title="删除角色">
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  this.showDeleteConfirm(record.id);
                }}
              >
                <DeleteOutlined type="delete" style={{ color: 'red' }} />
              </Button>
            </Tooltip>
          );
          const ty_bt =
            record.status === 'NORMAL' ? (
              <Tooltip placement="top" title="停用角色">
                <Button
                  type="link"
                  style={{ paddingLeft: 0 }}
                  onClick={() => this.tyConfirm(record)}
                >
                  <StopOutlined type="stop" style={{ color: 'red' }} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip placement="top" title="启用角色">
                <Button
                  type="link"
                  style={{ paddingLeft: 0 }}
                  onClick={() => this.qyConfirm(record)}
                >
                  <checkCircleOutlined style={{ color: 'green' }} />
                </Button>
              </Tooltip>
            );
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
              <Tooltip title="授权菜单">
                <Tag
                  onClick={() => {
                    history.push(`/admin/system/limit/roleMenu/${record.id}`);
                  }}
                >
                  授权菜单
                </Tag>
              </Tooltip>
            </div>
          );
          const gd_bt = (
            <Tooltip placement="top" title={tt}>
              <Button type="link" style={{ paddingLeft: 0 }}>
                <rightCircleOutlined style={{ color: 'blue' }} />
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
        <Content className={styles.contentbox}>
          <div className={styles.header}>
            <span className={styles.tit}>角色管理</span>
            <Button className={styles.addBtn} onClick={this.handleShow}>
              <Icon type="search" />
              {this.state.Show}
            </Button>
            <Button
              type="default"
              className={styles.addBtn}
              onClick={() => {
                history.push('/admin/system/limit/roleadd'); // 跳转方式 2
              }}
            >
              <Icon type="plus" />
              新增
            </Button>
          </div>
          <div className={styles.rightDiv}>
            <Form
              ref={this.formRef}
              layout="inline"
              style={{ display: this.state.isShow }}
            >
              <Form.Item label="角色名称：" name="roleName">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="角色编码：" name="roleCode">
                <Input allowClear />
              </Form.Item>
              <Form.Item label="用户类型：" name="roleType">
                <Select allowClear>
                  <Option value="USER">员工</Option>
                  <Option value="ORGANIZARION">组织</Option>
                </Select>
              </Form.Item>
              <Form.Item label="是否系统：" name="sys">
                <Select allowClear>
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;状态"
                name="roleStatusType"
              >
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
              scroll={{ x: 1100 }}
            />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default RoleList;
