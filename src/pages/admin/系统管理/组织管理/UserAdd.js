/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react'
import { Button, Col, Divider, Input, Row, Select, Form, Icon, Table, Modal, message, TreeSelect } from 'antd'
import {history} from 'umi'
import { post, get } from '@/utils/http'
import styles from './User.less'
import OrgTreeSelect from '@/components/OrgTreeSelect'
import CompanyTreeSelect from '@/components/CompanyTreeSelect'
import StationSelect from '@/components/StationSelect'

const { Option } = Select
const { TextArea, Search } = Input

class UserAdd extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      pagination: { current: 0, pageSize: this.PageSize },
      loading: false,
      dataSource: [],
      visible: false,
      data: [],
      sysOfficeSysPostList: [],
    }
    this.RoleList = []
    this.fushuRandom = 0 // 用于附属机构key
  }

  componentDidMount() {
    this.getRoleList()
  }

  getRoleList = (params = {}) => {
    const newParams = { page: 0, size: this.PageSize, ...params }
    get('sys-roles', newParams).then(res => {
      const { pagination } = this.state
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

  handleClose = () => {
    history.push('/admin/system/organ/userlist')
  }

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false
      const postData = { ...values }
      let officePostInfoList = []
      // eslint-disable-next-line guard-for-in
      for (let item in postData) {
        // 附属机构-1 必定 有 附属岗位-1 // {附属机构id:附属岗位id,附属机构id:附属岗位id} 附属岗位不必填有可能是undefined
        if (item.indexOf('fushujigou-') >= 0) {
          let num = item.split('-')[1]
          officePostInfoList.push({
            office: {
              id: postData[item],
            },
            post: {
              id: postData[`fushugangwei-${num}`] ? postData[`fushugangwei-${num}`] : '',
            },
          })
        }
      }

      let { postInfoList } = postData
      let postInfoListArr = []
      if (postInfoList && postInfoList.length) {
        postInfoList.forEach(item => {
          postInfoListArr.push({ id: item })
        })
      }
      postData.postInfoList = postInfoListArr
      postData.officePostInfoList = officePostInfoList
      postData.userInfo.roleList = this.RoleList
      postData.userInfo.status = 'NORMAL'
      post('sys/user-employees', postData).then(res => {
        message.success(`新增成功`)
      })
    })
  }

  addOneFushu = () => {
    const obj = { index: this.fushuRandom++ }
    this.setState(prevState => ({ sysOfficeSysPostList: prevState.sysOfficeSysPostList.concat(obj) }))
  }

  removeOneFushu = index => {
    this.setState(prevState => ({ sysOfficeSysPostList: prevState.sysOfficeSysPostList.filter(item => item.index !== index) }))
  }

  render() {
    const { data, sysOfficeSysPostList } = this.state
    const { getFieldDecorator } = this.props.form
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.RoleList = []
        selectedRowKeys.forEach(item => {
          this.RoleList.push({ id: item })
        })
      },
    }
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    }
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
      },
      {
        title: '角色编码',
        dataIndex: 'roleCode',
      },
    ]

    return (
      <div className={styles.contentbox}>
        <div className={styles.header}>
          <span className={styles.tit}>{this.state.title}用户</span>
        </div>
        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Form {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='归属机构'>
                  {getFieldDecorator('officeInfo.id', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                  })(<OrgTreeSelect mode='id' />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='归属公司'>{getFieldDecorator('companyInfo.id')(<CompanyTreeSelect mode='id' />)}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='登录账号'>
                  {getFieldDecorator('userInfo.loginCode', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='用户昵称'>
                  {getFieldDecorator('userInfo.userName', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='电子邮箱'>
                  {getFieldDecorator('userInfo.email', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                  })(<Input addonAfter={<Icon type='mail' />} allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='手机号码'>
                  {getFieldDecorator('userInfo.mobile', {
                    rules: [
                      {
                        required: true,
                        message: '必填!',
                      },
                    ],
                  })(<Input addonAfter={<Icon type='mobile' />} allowClear />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='办公电话'>{getFieldDecorator('userInfo.phone')(<Input addonAfter={<Icon type='phone' />} allowClear />)}</Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='权重(排序)：'>
                  {getFieldDecorator('userInfo.userSort')(<Input placeholder='权值越大排名越靠前，请填写数字' allowClear />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <p className={styles.addtit}>详细信息</p>
          <Divider />
          <Form {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='员工编号'>{getFieldDecorator('empCode', {})(<Input />)}</Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='员工姓名'>{getFieldDecorator('empName', {})(<Input />)}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='所在岗位'>{getFieldDecorator('postInfoList')(<StationSelect mode='multiple' />)}</Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='英文名'>{getFieldDecorator('empNameEn', {})(<Input />)}</Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item label='附属机构' wrapperCol={{ span: 19 }} labelCol={{ span: 3 }}>
                  <Row gutter={16} style={{ backgroundColor: '#F0F0F0' }}>
                    <Col span={1} />
                    <Col span={10}>附属机构</Col>
                    <Col span={10}>附属岗位</Col>
                    <Col span={2}>操作</Col>
                  </Row>
                  {sysOfficeSysPostList.map((item, i) => {
                    return (
                      <Row gutter={16} key={item.index}>
                        <Col span={1}>{i + 1}</Col>
                        <Col span={10}>
                          <Form.Item>
                            {getFieldDecorator(`fushujigou-${item.index}`, {
                              rules: [
                                {
                                  required: true,
                                  message: '必填!',
                                },
                              ],
                            })(<OrgTreeSelect mode='id' />)}
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item>{getFieldDecorator(`fushugangwei-${item.index}`, {})(<StationSelect allowClear />)}</Form.Item>
                        </Col>
                        <Col span={2}>
                          <Button
                            type='link'
                            style={{ color: 'red' }}
                            onClick={() => {
                              this.removeOneFushu(item.index)
                            }}
                          >
                            <Icon type='delete' />
                          </Button>
                        </Col>
                      </Row>
                    )
                  })}
                  <Row>
                    <Col span={10} offset={1}>
                      <Button type='primary' onClick={this.addOneFushu}>
                        <Icon type='plus' />
                        增行
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item label='备注信息' wrapperCol={{ span: 19 }} labelCol={{ span: 3 }}>
                  {getFieldDecorator('remarks', { initialValue: data.remarks })(<TextArea rows={4} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <p className={styles.addtit}>分配角色</p>
          <Divider />
          <Table
            dataSource={this.state.dataSource}
            columns={columns}
            rowKey={record => record.id}
            pagination={this.state.pagination}
            loading={this.state.loading}
            rowSelection={rowSelection}
          />

          <Button type='primary' style={{ marginLeft: 160 }} onClick={this.submit}>
            保存
          </Button>
          <Button type='default' style={{ marginLeft: 15 }} onClick={this.handleClose}>
            关闭
          </Button>
        </div>

        <Modal title='信息' visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <p>
            <Icon type='question-circle' style={{ color: '#FFCC00', fontSize: '30px', paddingRight: '10px' }} />
            你确认要删除这条数据吗？
          </p>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(UserAdd)
