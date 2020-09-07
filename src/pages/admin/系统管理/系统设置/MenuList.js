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
  Divider,
  Form,
  Input,
  Table,
  Tooltip,
  Modal,
  Row,
  Col,
  Select,
  message,
  TreeSelect,
  Radio,
  notification,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
  SyncOutlined,
  SortAscendingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { del, get, post, put } from '@/utils/http';
import styles from './Menu.less';

const { confirm } = Modal;
const { Option } = Select;
const { Search, TextArea } = Input;

class MenuList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: false,
      tableKey: 0, //用于展开折叠全部行
    };
    this.defaultExpandAllRows = false; //默认展开全部行 配合tableKey 使用
    this.sortChangeRecord = []; // 排序修改使用
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = (params = {}) => {
    let queryConditions = {};
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     queryConditions = values;
    //   }
    // });
    this.setState({ loading: true });
    const newParams = { ...params, ...queryConditions };
    get('SysMenuResource/findALLMenu', newParams).then(res => {
      this.setState({
        loading: false,
        dataSource: res.data,
      });
    });
  };

  expandRows = isExpand => {
    // 折叠
    this.defaultExpandAllRows = isExpand;
    this.setState(prevState => ({ tableKey: prevState.tableKey + 1 }));
  };

  // 排序
  sortChange = (e, record) => {
    // console.log(e.target.value, record);
    let rec = Object.assign(record);
    rec.menuSort = e.target.value;
    this.sortChangeRecord = this.sortChangeRecord.filter(
      item => item.id !== rec.id,
    );
    this.sortChangeRecord.push(rec);
  };

  saveSort = () => {
    put('SysMenuResource/saveSort', this.sortChangeRecord).then(res => {
      notification.success({ message: '保存成功' });
    });
  };

  // 删除
  showDeleteConfirm = record => {
    const that = this;
    confirm({
      title: '信息',
      content: '确认要删除该菜单及所有子菜单吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        del(`SysMenuResource/deleteMenu?menuId=${record.id}`).then(res => {
          that.fetch();
          notification.success({ message: '删除成功' });
        });
      },
    });
  };

  render() {
    const columns = [
      {
        title: '菜单名称',
        dataIndex: 'name',
      },
      {
        title: '链接',
        dataIndex: 'path',
      },
      {
        title: '排序',
        dataIndex: 'menuSort',
        render: (text, record) => {
          return (
            <Input
              defaultValue={text}
              onChange={e => this.sortChange(e, record)}
              style={{ width: 100 }}
            />
          );
        },
      },
      {
        title: '类型',
        dataIndex: 'menuType',
        render: (text, record) => {
          return text === 'MENU' ? '菜单' : '权限';
        },
      },
      {
        title: '可见',
        dataIndex: 'isShow',
        render: (text, record) => {
          return text ? '显示' : '隐藏';
        },
      },
      {
        title: '权限标识',
        dataIndex: 'permission',
      },
      {
        title: '操作',
        dataIndex: 'operator',
        render: (text, record) => {
          const bj_bt = (
            <Tooltip placement="top" title="编辑菜单">
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  history.push({
                    pathname: `/admin/system/setting/menuedit/${record.id}`,
                  });
                }}
              >
                <EditOutlined style={{ color: 'green' }} />
              </Button>
            </Tooltip>
          );
          const del_bt = (
            <Tooltip placement="top" title="删除菜单">
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  this.showDeleteConfirm(record);
                }}
              >
                <DeleteOutlined style={{ color: 'red' }} />
              </Button>
            </Tooltip>
          );
          return (
            <span>
              {bj_bt}
              {del_bt}
            </span>
          );
        },
      },
    ];
    return (
      <div className={styles.contentbox}>
        <div className={styles.header}>
          <span className={styles.tit}>菜单管理（主菜单管理）</span>
          <Button
            type="default"
            className={styles.addBtn}
            onClick={() => {
              history.push('/admin/system/setting/menuadd'); // 跳转方式 2
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
          <Button type="default" className={styles.addBtn} onClick={this.fetch}>
            <SyncOutlined />
            刷新
          </Button>
          <Button
            type="default"
            className={styles.addBtn}
            onClick={this.saveSort}
          >
            <SortAscendingOutlined />
            保存排序
          </Button>
        </div>
        <div className={styles.rightDiv}>
          <Table
            key={this.state.tableKey}
            defaultExpandAllRows={this.defaultExpandAllRows}
            dataSource={this.state.dataSource}
            columns={columns}
            pagination={{ pageSize: 99999 }}
            rowKey={record => record.id}
            loading={this.state.loading}
            onChange={this.handleTableChange}
          />
        </div>
      </div>
    );
  }
}

export default MenuList;
