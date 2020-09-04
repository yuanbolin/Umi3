/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react'
import { Button, Col, Divider, Input, Row, Select, DatePicker, Table, Icon, Layout, Radio, Tree, Form } from 'antd'
import moment from 'moment'
import { connect,history } from 'umi'
import { get } from '@/utils/http'
import styles from './Second.less'
import TreeMenu from '@/components/Tree'

const { TreeNode } = Tree
const { TextArea, Search } = Input
const { Option } = Select
const { Content } = Layout

class SecondAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    // this.fetch();
  }

  handleClose = () => {
    this.props.dispatch({
      type: 'routerTabs/closePage',
      payload: { closePath: this.props.location.pathname },
    })
    history.goBack()
  }

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false
      console.log(values)
    })
  }

  onChange = e => {
    console.log('radio checked', e.target.value)
    this.setState({
      value: e.target.value,
    })
  }

  fetch = (params = {}) => {
    let queryConditions = {}
    this.props.form.validateFields((err, values) => {
      if (!err) {
        queryConditions = values
      }
    })
    this.setState({ loading: true })
    const { pagination } = this.state
    if (Object.keys(params).length === 0 && pagination.current !== 0) {
      pagination.current = 0
      this.setState(pagination)
    }
    const newParams = { size: this.PageSize, ...params, ...queryConditions }
    get('t-customer-changes', newParams).then(res => {
      pagination.total = parseInt(res.headers['x-total-count'], 10)
      this.setState({
        loading: false,
        dataSource: res.data,
        pagination,
      })
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current - 1
    this.setState({ pagination })
    this.fetch({
      page: pager.current,
      ...filters,
    })
  }

  render() {
    const columns = [
      {
        title: '登录账号',
        dataIndex: 'dlzh',
      },
      {
        title: '用户昵称',
        dataIndex: 'yhnc',
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
      },
      {
        title: '手机号码',
        dataIndex: 'mobilephone',
      },
      {
        title: '办公电话',
        dataIndex: 'call',
      },
      {
        title: '更新时间',
        dataIndex: 'updatetime',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '操作',
        dataIndex: 'operator',
      },
    ]
    const dateFormat = 'YYYY/MM/DD'
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
        <div className={styles.header}>
          <span className={styles.tit}>用户选择</span>
        </div>

        <div className={styles.middle}>
          <div className={styles.rightDiv}>
            <Form layout='inline' style={{ display: this.state.isShow }}>
              <Row>
                <Col span={6}>
                  <Form.Item label='账号：'>{getFieldDecorator(`zh`)(<Input allowClear />)}</Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label='昵称：'>{getFieldDecorator(`nc`)(<Input allowClear />)}</Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item label='邮箱：'>{getFieldDecorator(`email`)(<Input allowClear />)}</Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label='手机：'>{getFieldDecorator(`mobilephone`)(<Input allowClear />)}</Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item label='电话：'>{getFieldDecorator(`call`)(<Input allowClear />)}</Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item>
                    <Button
                      type='primary'
                      onClick={() => {
                        this.fetch()
                      }}
                    >
                      查询
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => {
                        this.props.form.resetFields()
                      }}
                    >
                      重置
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Divider dashed='true' />
            </Form>

            <Table
              dataSource={this.state.dataSource}
              columns={columns}
              rowKey={record => record.id}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
            />
          </div>
          <Button type='primary' style={{ marginLeft: 190, marginTop: 15 }} onClick={this.submit}>
            保存
          </Button>
          <Button type='default' style={{ marginLeft: 10, marginTop: 15 }} onClick={this.handleClose}>
            关闭
          </Button>
        </div>
      </div>
    )
  }
}

export default connect()(Form.create()(SecondAdd))
