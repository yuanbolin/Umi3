import React, { Component } from 'react';
import { Breadcrumb, Tabs } from 'antd';
import styles from './zhgl.less';
import EditPassword from './editPassword';
import EditUserInfo from './editUserInfo';

function Zhgl() {
  return (
    <div id='account_div'>
      <Breadcrumb className='mybread' style={{ margin: '10px 20px' }}>
        <Breadcrumb.Item>帐号管理</Breadcrumb.Item>
      </Breadcrumb>
      <div className='MAIN-BOX'>
        <Tabs tabPosition='left'>
          <Tabs.TabPane tab='个人信息' key='1'>
            <EditUserInfo />
          </Tabs.TabPane>
          <Tabs.TabPane tab='修改密码' key='2'>
            <EditPassword />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Zhgl;
