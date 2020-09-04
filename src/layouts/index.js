/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-27 11:50:25
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-08-28 15:54:09
 * @Description: Description
 */

import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Avatar, ConfigProvider } from 'antd';
import { DownOutlined ,UserOutlined} from '@ant-design/icons';
import { Link } from 'umi';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import defaultSettings from '@/../config/defaultSettings';
import styles from './index.less';
import HeaderBell from '../components/HeaderBell/Index';
import 'moment/locale/zh-cn';
import BasicMenu from './Menu';
import RouterTabs from '../components/RouterTabs';

moment.locale('zh-cn');
const { Header, Content, Sider } = Layout;
export default function BasicLayout(props) {
  function logout() {
    window.location.href = '#/login';
    sessionStorage.clear();
  }

  const user_menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/app/zhgl">帐号管理</Link>
      </Menu.Item>
      <Menu.Item key="2" onClick={logout}>
        退出
      </Menu.Item>
    </Menu>
  );

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh', height: '100%' }}>
        <Header className={styles.header}>
          <div className={styles.logo} />
          {/* <p className={styles.title} style={{ color: defaultSettings.primaryColor }}> */}
          {/* {defaultSettings.title} */}
          {/* </p> */}
          <Dropdown className={styles.dropdown} overlay={user_menu}>
            <a className="ant-dropdown-link">
              <Avatar icon={<UserOutlined/>} size="small" />
              {` ${sessionStorage.getItem('USER-NAME')}`}
              <DownOutlined />
            </a>
          </Dropdown>
          <HeaderBell />
        </Header>
        <Layout>
          <Sider
            className={styles.rwSider}
            theme={defaultSettings.navTheme}
            width={226}
          >
            <BasicMenu />
          </Sider>
          <Content>
            <RouterTabs />
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
