import React, { Component } from 'react';
import classNames from 'classnames';
import { Tag, Dropdown, Tooltip, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { withRouter, history ,connect } from 'umi';
import styles from './index.less';
import defaultSettings from '@/../config/defaultSettings';
import {getTitleByPathname} from './getTitleByPathname';

const { SubMenu } = Menu;

const namespace = 'routerTabs';

class RouterTabs extends Component {
  handleClose = (tag, e) => {
    let { currentPath, refsTag } = this.props;
    // const { searchMap } = this.props;
    const newRefsTag = [...refsTag.filter(t => t !== tag)];
    // 关闭当前页
    if (currentPath === tag) {
      currentPath = refsTag[refsTag.indexOf(tag) - 1];
      history.push({
        pathname: currentPath,
        // search: searchMap[currentPath],
      });
    }

    this.props.dispatch({
      type: `${namespace}/closePage`,
      payload: { closePath: tag },
    });

    // this.props.dispatch({
    //   type: `${namespace}/save`,
    //   payload: { refsTag: newRefsTag },
    // })

    if (e && e.stopPropagation)
      // 因此它支持W3C的stopPropagation()方法
      e.stopPropagation();
    // 否则，我们需要使用IE的方式来取消事件冒泡
    else window.event.cancelBubble = true;
  };

  handleClickTag = (tag, e) => {
    if (tag !== this.props.currentPath) {
      history.push({
        pathname: tag,
        // search: this.state.searchMap[tag] ? this.state.searchMap[tag].replace(/from=[^&]+&?/, '') : undefined,
      });
      sessionStorage.setItem(`${this.props.currentPath}-close`, 'false');
    }
  };

  handleMenuClick = e => {
    const eKey = e.key;
    let { currentPath, refsTag } = this.props;

    let newRefsTag;
    if (eKey === '1') {
      newRefsTag = [refsTag[0]];
      history.push({
        pathname: refsTag[0],
      });
    } else if (eKey === '2') {
      newRefsTag = [refsTag[0], currentPath];
    } else {
      this.handleClickTag(eKey);
      return;
    }
    if (newRefsTag) {
      this.props.dispatch({
        type: `${namespace}/save`,
        payload: { refsTag: newRefsTag },
      });
    }
  };

  render() {
    const { currentPath, refsTag } = this.props;
    const { className, style } = this.props; // 可以在父组件定义样式
    const cls = classNames(styles['router-tabs'], className);
    const tags = refsTag.map((pathname, index) => {
      const title = getTitleByPathname(pathname);
      if (!title) return null;
      const isLongTag = title.length > 30;
      const tagElem = (
        <Tag
          key={pathname}
          data-key={pathname}
          className={classNames(styles.tag, {
            [styles.active]: pathname === currentPath,
          })}
          onClick={e => this.handleClickTag(pathname, e)}
          closable={index !== 0}
          onClose={e => this.handleClose(pathname, e)}
        >
          {pathname === currentPath ? (
            <span
              className={styles.icon}
              style={{ background: defaultSettings.primaryColor }}
            />
          ) : (
            <span className={styles.icon} />
          )}

          {isLongTag ? `${title.slice(0, 30)}...` : title}
        </Tag>
      );
      return isLongTag ? (
        <Tooltip title={title} key={`tooltip_${pathname}`}>
          {tagElem}
        </Tooltip>
      ) : (
        tagElem
      );
    });
    this.tags = tags;
    /* eslint-disable */
    return (
      <div
        className={cls}
        style={{
          ...style,
          height: '40px',
          maxHeight: '40px',
          lineHeight: '40px',
          marginRight: '-12px',
        }}
      >
        <div
          style={{
            flex: '1',
            height: '40px',
            position: 'relative',
            overflow: 'hidden',
            background: '#f0f0f0',
            padding: '0px 0px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              whiteSpace: 'nowrap',
              width: '100%',
              top: '0px',
              padding: '0px 10px 0px 10px',
              overflowX: 'auto',
            }}
          >
            {tags}
          </div>
        </div>
        <div
          style={{
            width: '96px',
            height: '100%',
            background: '#fff',
            boxShadow: '-3px 0 15px 3px rgba(0,0,0,.1)',
          }}
        >
          <Dropdown
            overlay={
              <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">关闭所有</Menu.Item>
                <Menu.Item key="2">关闭其他</Menu.Item>
                <SubMenu title="切换标签">
                  {tags.map(item => (
                    <Menu.Item key={item.key}>{item.props.children}</Menu.Item>
                  ))}
                </SubMenu>
              </Menu>
            }
          >
            <Tag size={'small'} color="#2d8cf0" style={{ marginLeft: 12 }}>
              标签选项 <DownOutlined type="" />
            </Tag>
          </Dropdown>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { currentPath, refsTag } = state[namespace];
  return {
    currentPath,
    refsTag,
  };
};
export default withRouter(connect(mapStateToProps)(RouterTabs));
