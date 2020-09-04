/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-27 11:50:25
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-08-28 15:54:09
 * @Description: Description
 */
import React, { Component } from 'react'
import { Menu } from 'antd'
import { HomeOutlined,SettingOutlined,ReadOutlined,ToolOutlined,DropboxOutlined,BankOutlined,AlertOutlined,BugOutlined,
  TwitterOutlined,AppstoreOutlined,UserOutlined,TeamOutlined} from '@ant-design/icons';
import { Link,withRouter } from 'umi'
import defaultSettings from '@/../config/defaultSettings'
import routers from '@/../config/router.config'

const { SubMenu } = Menu
class BasicMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuArr: [],
    }
  }

  componentDidMount() {
    this.getMenu()
  }

  getMenu = () => {
    // 请求routers
    this.setState({ menuArr: routers })
  }

  onOpenChange = openKeys => {
    sessionStorage.setItem('openKeys', JSON.stringify(openKeys))
  }

  onSelect = item => {
    sessionStorage.setItem('menuSelectKeys', JSON.stringify(item.key))
  }

  renderIcon=icon=>{
    switch (icon) {
      case 'HomeOutlined':
        return <HomeOutlined/>
        break;
      case 'SettingOutlined':
        return <SettingOutlined/>
        break;
      case 'ReadOutlined':
        return <ReadOutlined/>
        break;
      case 'ToolOutlined':
        return <ToolOutlined/>
        break;
      case 'DropboxOutlined':
        return <DropboxOutlined/>
        break;
      case 'BankOutlined':
        return <BankOutlined/>
        break;
      case 'AlertOutlined':
        return <AlertOutlined/>
        break;
      case 'TwitterOutlined':
        return <TwitterOutlined/>
        break;
      case 'AppstoreOutlined':
        return <AppstoreOutlined/>
        break;
        case 'UserOutlined':
        return <UserOutlined/>
        break;
        case 'BugOutlined':
        return <BugOutlined/>
        break;
        case 'TeamOutlined':
        return <TeamOutlined/>
        break;
      default:
        return <AppstoreOutlined/>
        break;
    }
  }

  menuMap = menu => {
    return menu.map(item => {
      if (item.hideMenu) return null
      if (!item.name && !item.routes) return null
      if (item.name && !item.routes) {
        const icon = item.icon ? this.renderIcon(item.icon) : null
        return (
          <Menu.Item key={item.path}>
            <Link to={item.path}>
              {icon}
              {item.name}
            </Link>
          </Menu.Item>
        )
      }
      if (item.name && item.routes) {
        const icon = item.icon ? this.renderIcon(item.icon) : null
        return (
          <SubMenu
            key={item.name}
            title={
              <span>
                {icon}
                {item.name}
              </span>
            }
          >
            {this.menuMap(item.routes)}
          </SubMenu>
        )
      }
      if (!item.name && item.routes) {
        return this.menuMap(item.routes)
      }
    })
  }

  getResultArr = theRouters => {
    const menuArr = this.menuMap(theRouters).filter(item => item !== null)
    console.log(menuArr)
    const resultArr = []
    const foreach = arr => {
      arr.forEach(item => {
        if (item instanceof Array) {
          foreach(item)
        } else if(item!=null) {
          resultArr.push(item)
        }
      })
    }
    foreach(menuArr)
    return resultArr
  }

  render() {
    return (
      <Menu
        theme={defaultSettings.navTheme}
        mode={defaultSettings.menuMode}
        onSelect={this.onSelect}
        defaultSelectedKeys={[sessionStorage.getItem('menuSelectKeys')?JSON.parse(sessionStorage.getItem('menuSelectKeys')):0]}
        defaultOpenKeys={sessionStorage.getItem('openKeys')?JSON.parse(sessionStorage.getItem('openKeys')):0}
        onOpenChange={this.onOpenChange}
      >
        {this.getResultArr(this.state.menuArr)}
      </Menu>
    )
  }
}

export default withRouter(BasicMenu)
