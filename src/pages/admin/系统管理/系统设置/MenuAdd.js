/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react'
import { Button, Col, Divider, Input, Row, Select, Form, Icon, Table, DatePicker, TreeSelect, Radio, Checkbox, message } from 'antd'
import { connect,history } from 'umi'
import { get, post, put } from '@/utils/http'
import styles from './Menu.less'
import MenuTreeSelect from '@/components/MenuTreeSelect'

const { TreeNode } = TreeSelect
const { Option } = Select
const { TextArea, Search } = Input

class MenuAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: undefined,
      title: '',
      data: {},
    }
    this.pageType = this.props.match.params.id ? 'edit' : 'add' // 判断页面是编辑还是新增
  }

  componentDidMount() {
    if (this.pageType === 'edit') {
      get('SysMenuResource/findMenuDetail', { menuId: this.props.match.params.id }).then(res => {
        this.setState({ data: res.data })
      })
    }
  }

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false
      if (this.pageType === 'edit') {
        const id = this.props.match.params.id
        const newParams = { id, ...values }
        put('SysMenuResource/editMenu', newParams).then(res => {
          message.success(`编辑ok`)
        })
      } else {
        post('SysMenuResource/addMenu', values).then(res => {
          message.success(`新增ok`)
        })
      }
    })
  }

  handleClose = () => {
    this.props.dispatch({
      type: 'routerTabs/closePage',
      payload: { closePath: this.props.location.pathname },
    })
    history.goBack()
  }

  render() {
    const { data } = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    }

    return (
      <div className={styles.contentbox}>
        {/* <div className={styles.header}> */}
        {/*  <span className={styles.tit}>{this.state.title}菜单</span> */}
        {/* </div> */}
        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Form {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='上级菜单：'>
                  {getFieldDecorator('parentId', { initialValue: data.parentId })(<MenuTreeSelect mode='id' />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='菜单类型：'>
                  {getFieldDecorator('menuType', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                    initialValue: data.menuType,
                  })(
                    <Radio.Group>
                      <Radio value='MENU'>菜单</Radio>
                      <Radio value='PERMISSION'>权限</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='菜单名称：'>{getFieldDecorator('menuName', { initialValue: data.menuName })(<Input allowClear />)}</Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='页签标题：'>{getFieldDecorator('menuTitle', { initialValue: data.menuTitle })(<Input allowClear />)}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='链接(Href)：'>{getFieldDecorator('menuHref', { initialValue: data.menuHref })(<Input allowClear />)}</Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='菜单图标：'>{getFieldDecorator('menuIcon', { initialValue: data.menuIcon })(<Search allowClear />)}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='排序(升序)：'>{getFieldDecorator('menuSort', { initialValue: data.menuSort })(<Input allowClear />)}</Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='权限标识：'>{getFieldDecorator('permission', { initialValue: data.permission })(<Input allowClear />)}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='可见：'>
                  {getFieldDecorator('isShow', { initialValue: data.isShow })(
                    <Radio.Group>
                      <Radio value>显示</Radio>
                      <Radio value={false}>隐藏</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <p className={styles.addtit}>其它信息</p>
          <Divider />
          <Form {...formItemLayout}>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item label='备注信息' wrapperCol={{ span: 19 }} labelCol={{ span: 3 }}>
                  {getFieldDecorator('remarks', { initialValue: data.remarks })(<TextArea rows={4} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Button type='primary' style={{ marginLeft: 160 }} onClick={this.submit}>
            保存
          </Button>
          <Button type='default' style={{ marginLeft: 15 }} onClick={this.handleClose}>
            关闭
          </Button>
        </div>
      </div>
    )
  }
}
export default connect()(Form.create()(MenuAdd))
