/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react'
import { Form, Button, Divider, Icon, Input, Layout, Select, Table, Tag, Tooltip, Modal, notification, Row, Col, message } from 'antd'

import {history} from 'umi'
import { get, del, put } from '@/utils/http'
import styles from './Station.less'

const { Option } = Select
const { Content } = Layout
const { confirm } = Modal
const { TextArea } = Input

class StationList extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      dataSource: [],
      loading: false,
      pagination: { current: 0, pageSize: this.PageSize },
      isShow: 'block',
      Show: '隐藏',
    }
  }

  componentDidMount() {
    this.fetch()
  }

  handleShow = () => {
    this.state.Show === '隐藏' ? this.setState({ isShow: 'none', Show: '查询' }) : this.setState({ isShow: 'block', Show: '隐藏' })
  }

  fetch = (params = {}) => {
    let queryConditions = {}
    this.props.form.validateFields((err, values) => {
      if (!err) {
        queryConditions = values
      }
    })
    this.setState({ loading: true })
    const newParams = { page: 0, size: this.PageSize, ...params, ...queryConditions }
    get('sys-posts', newParams).then(res => {
      const { pagination } = this.state
      if (Object.keys(params).length === 0 && pagination.current !== 0) {
        pagination.current = 0
      }
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

  showDeleteConfirm = id => {
    const that = this
    confirm({
      title: '信息',
      content: '确认要删除该岗位吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        del(`sys-posts/${id}`).then(res => {
          notification.success({
            message: '删除成功',
          })
          that.fetch()
        })
      },
    })
  }

  tyConfirm = record => {
    const that = this
    confirm({
      title: '停用',
      content: '确认要停用该岗位吗?',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const obj = Object.assign({}, record)
        obj.status = 'DISABLE'
        put('sys-posts', obj).then(res => {
          notification.success({
            message: '停用成功',
          })
          that.fetch()
        })
      },
    })
  }

  qyConfirm = record => {
    const that = this
    confirm({
      title: '启用',
      content: '确认要启用该岗位吗?',
      okText: '确认',
      okType: 'success',
      cancelText: '取消',
      onOk() {
        const obj = Object.assign({}, record)
        obj.status = 'NORMAL'
        put('sys-posts', obj).then(res => {
          notification.success({
            message: '启用成功',
          })
          that.fetch()
        })
      },
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const defaultVal = JSON.parse(sessionStorage.getItem(this.props.match.url))
    const columns = [
      {
        title: '岗位名称',
        dataIndex: 'postName',
      },
      {
        title: '岗位编码',
        dataIndex: 'postCode',
      },
      {
        title: '岗位分类',
        dataIndex: 'postType',
        render: text => {
          if (text === 'SENIOR') return '高层'
          if (text === 'MIDDLE') return '中层'
          if (text === 'BASIC') return '基层'
        },
      },
      {
        title: '备注信息',
        dataIndex: 'remarks',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text => {
          if (text === 'NORMAL') return <Tag color='blue'>正常</Tag>
          if (text === 'DISABLE') return <Tag color='red'>停用</Tag>
        },
      },
      {
        title: '操作',
        dataIndex: 'operator',
        render: (text, record) => {
          const bj_bt = (
            <Tooltip placement='top' title='编辑岗位'>
              <Button
                type='link'
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  history.push({ pathname: `/admin/system/organ/stationedit/${record.id}` })
                }}
              >
                <Icon type='edit' style={{ color: 'green' }} />
              </Button>
            </Tooltip>
          )
          const del_bt = (
            <Tooltip placement='top' title='删除岗位'>
              <Button
                type='link'
                style={{ paddingLeft: 0 }}
                onClick={() => {
                  this.showDeleteConfirm(record.id)
                }}
              >
                <Icon type='delete' style={{ color: 'red' }} />
              </Button>
            </Tooltip>
          )
          const ty_bt =
            record.status === 'NORMAL' ? (
              <Tooltip placement='top' title='停用岗位'>
                <Button type='link' style={{ paddingLeft: 0 }} onClick={() => this.tyConfirm(record)}>
                  <Icon type='stop' style={{ color: 'red' }} />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip placement='top' title='启用岗位'>
                <Button type='link' style={{ paddingLeft: 0 }} onClick={() => this.qyConfirm(record)}>
                  <Icon type='check-circle' style={{ color: 'green' }} />
                </Button>
              </Tooltip>
            )
          return (
            <span>
              {bj_bt}
              {ty_bt}
              {del_bt}
            </span>
          )
        },
      },
    ]

    return (
      <Layout>
        <Content className={styles.contentbox}>
          <div className={styles.header}>
            <span className={styles.tit}>岗位管理</span>
            <Button className={styles.addBtn} onClick={this.handleShow}>
              {this.state.Show}
            </Button>
            <Button
              type='default'
              className={styles.addBtn}
              onClick={() => {
                history.push('/admin/system/organ/stationadd') // 跳转方式 2
              }}
            >
              <Icon type='plus' />
              新增
            </Button>
          </div>
          <div className={styles.rightDiv}>
            <Form layout='inline' style={{ display: this.state.isShow }}>
              <Form.Item label='岗位编码'>
                {getFieldDecorator(`postCode`, {
                  initialValue: defaultVal ? defaultVal.postCode : '',
                })(<Input allowClear />)}
              </Form.Item>
              <Form.Item label='岗位名称'>
                {getFieldDecorator(`postName`, {
                  initialValue: defaultVal ? defaultVal.postName : '',
                })(<Input allowClear />)}
              </Form.Item>
              <Form.Item label='岗位分类'>
                {getFieldDecorator(`postType`, {
                  initialValue: defaultVal ? defaultVal.postType : '',
                })(
                  <Select allowClear>
                    <Option value='SENIOR'>高管</Option>
                    <Option value='MIDDLE'>中层</Option>
                    <Option value='BASIC'>基层</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label='状态'>
                {getFieldDecorator(`status`, {
                  initialValue: defaultVal ? defaultVal.status : '',
                })(
                  <Select allowClear>
                    <Option value='NORMAL'>正常</Option>
                    <Option value='DISABLE' style={{ color: 'red' }}>
                      停用
                    </Option>
                  </Select>
                )}
              </Form.Item>
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
              <Divider dashed='true' />
            </Form>

            <div>
              <Table
                dataSource={this.state.dataSource}
                columns={columns}
                expandRowByClick
                rowKey={record => record.id}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
              />
            </div>
          </div>
        </Content>
      </Layout>
    )
  }
}

const wapper = Form.create()(StationList)
export default wapper
