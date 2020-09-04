/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-09 09:08:13
 * @Description: Description
 */
import React, { Component } from 'react';
import { Layout, Tree } from 'antd';
import {
  EditOutlined,
  RedoOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { Link } from 'umi';
import styles from './index.less';
import { get } from '@/utils/http';

const { Sider } = Layout;
const { TreeNode } = Tree;

class TreeSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      expandedKeys: [],
      isExpanded: false,
      data: [],
      selectedKeys: [],
    };
  }

  componentDidMount() {
    const initValState = sessionStorage.getItem(
      `${this.props.match.url}-siderBar`,
    );
    if (initValState) {
      console.log('initValState==>', initValState);
      this.setState({ ...JSON.parse(initValState) });
    } else {
      this.fetch();
    }
  }

  componentWillUnmount() {
    if (sessionStorage.getItem(`${this.props.match.url}-close`) === 'false') {
      sessionStorage.setItem(
        `${this.props.match.url}-siderBar`,
        JSON.stringify(this.state),
      );
    } else {
      sessionStorage.removeItem(`${this.props.match.url}-siderBar`);
    }
  }

  fetch = () => {
    get('sys-offices/tree').then(res => {
      console.log('tree==>', res.data);
      this.setState({ data: res.data });
    });
  };

  refresh = () => {
    this.setState({ data: [] });
    this.fetch();
  };

  onExpand = (expandedKeys, { expanded: bool, node }) => {
    this.setState({ expandedKeys });
  };

  toggleExpand = () => {
    const { isExpanded, data } = this.state;
    if (isExpanded) {
      this.setState({
        isExpanded: false,
        expandedKeys: [],
      });
      this.expandedKeys = null; // 避免每次遍历 提升效率
    } else {
      if (!this.expandedKeys) {
        this.expandedKeys = [];
        const loop = datas => {
          datas.forEach(item => {
            if (item.children) {
              this.expandedKeys.push(item.sysOffice.id);
              loop(item.children);
            }
          });
        };
        loop(data);
      }
      console.log('expandedKeys==>', this.expandedKeys);
      this.setState({
        expandedKeys: this.expandedKeys,
        isExpanded: true,
      });
    }
  };

  renderTree = data => {
    return data.map(item => {
      return (
        <TreeNode key={item.sysOffice.id} title={item.sysOffice.officeName}>
          {item.children ? this.renderTree(item.children) : null}
        </TreeNode>
      );
    });
  };

  onSelect = value => {
    const v = value[0] ? value[0] : null;
    this.props.onSelect(v);
    this.setState({ selectedKeys: value });
  };

  render() {
    const { isExpanded, expandedKeys, data, selectedKeys } = this.state;
    const treeOpt = this.renderTree(data);
    return (
      <Sider
        className={styles.sider}
        theme="light"
        width={220}
        collapsible
        collapsedWidth={0}
        collapsed={this.state.collapsed}
        onCollapse={collapsed => {
          this.setState({ collapsed });
        }}
      >
        <div className={styles.header}>
          <span className={styles.tit}>组织机构</span>
          <Link to="/admin/system/organ/organizelist" title="编辑">
            <EditOutlined  />
          </Link>
          <span
            onClick={this.toggleExpand}
            title={isExpanded ? '折叠' : '展开'}
          >
            {isExpanded ? (
              <UpOutlined />
            ) : (
              <DownOutlined />
            )}
          </span>
          <span onClick={this.refresh} title="刷新">
            <RedoOutlined  />
          </span>
        </div>
        <div className={styles.treeDiv}>
          <Tree
            expandedKeys={expandedKeys}
            onExpand={this.onExpand}
            blockNode
            style={{ fontSize: 12 }}
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
          >
            {treeOpt}
          </Tree>
        </div>
      </Sider>
    );
  }
}
export default TreeSideBar;
