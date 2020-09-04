import React, { Component } from 'react';
import { Tree } from 'antd';
import styles from './index.less';

const { TreeNode } = Tree;

export default class TreeMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  render() {
    return (
      <div className={styles.tree}>
        <Tree showLine defaultExpandedKeys={['0-0-0']} onSelect={this.onSelect} checkable>
          <TreeNode title='主导航菜单' key='0'>
            <TreeNode title='系统管理' key='0-0'>
              <TreeNode title='组织管理' key='0-0-0'>
                <TreeNode title='用户管理' key='0-0-0-0' />
                <TreeNode title='机构管理' key='0-0-0-1' />
                <TreeNode title='公司管理' key='0-0-0-2' />
                <TreeNode title='岗位管理' key='0-0-0-3' />
              </TreeNode>
              <TreeNode title='权限管理' key='0-0-1'>
                <TreeNode title='角色管理' key='0-0-1-0' />
                <TreeNode title='二级管理员' key='0-0-1-1' />
              </TreeNode>
              <TreeNode title='系统设置' key='0-0-2'>
                <TreeNode title='参数设置' key='0-0-2-0' />
              </TreeNode>
              <TreeNode title='系统监控' key='0-0-3'>
                <TreeNode title='访问日志' key='0-0-3-0' />
                <TreeNode title='在线用户' key='0-0-3-1' />
              </TreeNode>
              <TreeNode title='消息推送' key='0-0-4'>
                <TreeNode title='未完成消息' key='0-0-4-0' />
                <TreeNode title='已完成消息' key='0-0-4-1' />
                <TreeNode title='消息模板管理' key='0-0-4-2' />
              </TreeNode>
              <TreeNode title='消息推送' key='0-0-5'>
                <TreeNode title='未完成消息' key='0-0-5-0' />
                <TreeNode title='已完成消息' key='0-0-5-1' />
                <TreeNode title='消息模板管理' key='0-0-5-2' />
              </TreeNode>
            </TreeNode>

            <TreeNode title='我的工作' key='0-1'>
              <TreeNode title='文件管理' key='0-1-0'>
                <TreeNode title='文件管理' key='0-1-0-0' />
                <TreeNode title='文件分享' key='0-1-0-1' />
              </TreeNode>
              <TreeNode title='站内消息' key='0-1-1'>
                <TreeNode title='查看' key='0-1-1-0' />
                <TreeNode title='编辑' key='0-1-1-1' />
                <TreeNode title='审核' key='0-1-1-2' />
              </TreeNode>
            </TreeNode>

            <TreeNode title='Cxsdsd' key='0-2' />
          </TreeNode>
        </Tree>
      </div>
    );
  }
}
