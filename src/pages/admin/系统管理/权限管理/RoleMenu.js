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
  Row,
  Button,
  Divider,
  message,
  Input,
  Checkbox,
  Col,
  Tree,
  notification,
  Form,
} from 'antd';
import { get, put } from '@/utils/http';
import { connect, history } from 'umi';
import styles from './Role.less';

const { TreeNode } = Tree;

class RoleMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      dataSource: [],
      expandedKeys: [],
      checkedKeys: [],
    };
  }

  componentDidMount() {
    this.fetch();
    this.getDetail();
  }

  getDetail = () => {
    get(`sys-roles/${this.props.match.params.id}`).then(res => {
      this.setState({ data: res.data, checkedKeys: res.data.sysMenuIds });
    });
  };

  fetch = () => {
    get('SysMenuResource/findALLMenu').then(res => {
      this.setState({
        dataSource: res.data,
      });
      // 获取所有ids 数组 方便展开折叠 全选等操作
      this.allMenuIds = [];
      const getAllIds = arr => {
        arr.forEach(item => {
          this.allMenuIds.push(item.id);
          if (item.children) getAllIds(item.children);
        });
      };
      getAllIds(res.data);
    });
  };

  submit = () => {
    const data2 = {
      roleId: this.props.match.params.id,
      menuIds: this.state.checkedKeys,
    };
    let data = new FormData();
    data.append('roleId', this.props.match.params.id);
    data.append('menuIds', this.state.checkedKeys);
    put(`SysMenuResource/updateRoleMenu`, data2).then(res => {
      message.success('Ok');
    });
  };

  expandAllorNot = isExpand => {
    this.setState({ expandedKeys: isExpand ? this.allMenuIds : [] });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
    });
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  checkAll = e => {
    this.setState({ checkedKeys: e.target.checked ? this.allMenuIds : [] });
  };

  handleClose = () => {
    this.props.dispatch({
      type: 'routerTabs/closePage',
      payload: { closePath: this.props.location.pathname },
    });
    history.goBack();
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item.name}
            key={item.id}
            treeData={this.renderTreeNodes(item.children)}
          />
        );
      }
      return <TreeNode key={item.id} title={item.name} {...item} />;
    });

  render() {
    return (
      <div className={styles.contentbox}>
        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Row>
            <Col span={10} offset={1}>
              角色名称：
              <Input value={this.state.data.roleName} disabled />
            </Col>
            <Col span={10} offset={2}>
              角色编码：
              <Input value={this.state.data.roleCode} disabled />
            </Col>
          </Row>
          <br />
          <p className={styles.addtit}>授权功能菜单</p>
          <Divider />
          <div>
            <Checkbox onChange={this.checkAll}>全选</Checkbox>
            <Button type="link" onClick={() => this.expandAllorNot(true)}>
              展开
            </Button>
            /
            <Button type="link" onClick={() => this.expandAllorNot(false)}>
              折叠
            </Button>
            <Tree
              checkable
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              selectedKeys={this.state.selectedKeys}
              treeData={this.renderTreeNodes(this.state.dataSource)}
            />
          </div>
          <Button
            type="primary"
            style={{ marginLeft: 190, marginTop: 15 }}
            onClick={this.submit}
          >
            保存
          </Button>
          <Button
            type="default"
            style={{ marginLeft: 10, marginTop: 15 }}
            onClick={this.handleClose}
          >
            关闭
          </Button>
        </div>
      </div>
    );
  }
}

export default connect()(RoleMenu);
