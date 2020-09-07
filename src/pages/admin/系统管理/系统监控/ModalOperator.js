/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react';
import {
  Button,
  Col,
  Divider,
  Input,
  Row,
  Select,
  DatePicker,
  Table,
  Layout,
  Radio,
  Tree,
  Form,
  Alert,
  Tag,
  Modal,
} from 'antd';

import { connect, history } from 'umi';
import { get } from '@/utils/http';
import TreeMenu from '@/components/Tree';
import styles from './Online.less';

const { TreeNode } = Tree;
const { TextArea, Search } = Input;
const { Option } = Select;
const { Content } = Layout;

class OperatorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectName: '',
      dataSource: [
        {
          key: '1',
          dlzh: '0001',
          yhnc: '李白',
          email: '0001@qqcom',
          mobilephone: '16756765432',
          call: '6787644',
          updatetime: '2015-3-5',
          status: '正常',
          lx: '员工',
        },
        {
          key: '2',
          dlzh: '0002',
          yhnc: '张三',
          email: '0002@qqcom',
          mobilephone: '12345677654',
          call: '67322222',
          updatetime: '2018-3-5',
          status: '异常',
          lx: '高管',
        },
        {
          key: '3',
          dlzh: '0003',
          yhnc: '李四',
          email: '0004@qqcom',
          mobilephone: '13456543454',
          call: '2345432',
          updatetime: '2019-6-5',
          status: '异常',
          lx: '员工',
        },
      ],
      visible: false,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.props);
    this.setState({
      visible: this.props.handleModal,
    });
    // this.fetch();
  }

  handleClose = () => {
    this.props.dispatch({
      type: 'routerTabs/closePage',
      payload: { closePath: this.props.location.pathname },
    });
    history.goBack();
  };

  submit = async () => {
    let queryConditions = await this.formRef.validateFields();
  };

  onChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      // value: e.target.value,
    });
  };

  colseTag = () => {
    this.setState({
      selectName: '',
    });
  };

  fetch = (params = {}) => {
    this.setState({ loading: true });
    const newParams = {
      size: this.PageSize,
      ...params,
      ...this.queryConditions,
    };
    get('t-customer-nsjls', newParams).then(res => {
      const { pagination } = this.state;
      if (
        Object.keys(params).length === 0 &&
        this.state.pagination.current !== 0
      ) {
        pagination.current = 0;
        this.setState(pagination);
      }
      pagination.total = parseInt(res.headers['x-total-count'], 10);
      this.setState({
        loading: false,
        dataSource: res.data.tCustomerNsjlList,
        info: res.data.tCustomerNsjlStatistic,
        pagination,
      });
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current - 1;
    this.setState({ pagination });
    this.fetch({
      page: pager.current,
      ...filters,
    });
  };

  colseTag = () => {
    this.setState({
      selectName: '',
    });
  };

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
        title: '类型',
        dataIndex: 'lx',
      },
    ];
    const dateFormat = 'YYYY/MM/DD';
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const { selectName } = this.state;
    return (
      <Layout>
        <Modal
          title="用户选择"
          visible={this.state.visible}
          onOk={() => this.props.onChange()}
          onCancel={() => this.props.onChange()}
          width="70%"
        >
          <div className={styles.contentbox}>
            <div className={styles.middle}>
              <div className={styles.rightDiv}>
                <Form
                  ref={this.formRef}
                  layout="inline"
                  style={{ display: this.state.isShow }}
                >
                  <Form.Item label="账号：">
                    <Input allowClear />
                  </Form.Item>
                  <Form.Item label="昵称：" name="yhnc">
                    <Input allowClear />
                  </Form.Item>
                  <Form.Item label="邮箱：" name="email">
                    <Input allowClear />
                  </Form.Item>
                  <Form.Item label="手机：" name="mobilephone">
                    <Input allowClear />
                  </Form.Item>
                  <Form.Item label="电话：" name="call">
                    <Input allowClear />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.fetch();
                      }}
                    >
                      查询
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => {
                        this.props.form.resetFields();
                      }}
                    >
                      重置
                    </Button>
                  </Form.Item>
                  <Divider dashed="true" />
                </Form>

                <Alert
                  type="info"
                  message={
                    <span>
                      当前已选择：
                      {selectName ? (
                        <Tag
                          closable
                          style={{ color: 'blue' }}
                          onClose={this.colseTag}
                        >
                          {selectName}
                        </Tag>
                      ) : null}
                    </span>
                  }
                />
                {/* {this.props.handleSearch(selectName)} */}
                <Table
                  dataSource={this.state.dataSource}
                  columns={columns}
                  rowKey={record => record.id}
                  pagination={this.state.pagination}
                  loading={this.state.loading}
                  onChange={this.handleTableChange}
                  onRow={record => {
                    return {
                      onClick: () => {
                        console.log(record.yhnc);
                        this.props.handleValue(record.yhnc);
                        this.setState({
                          selectName: record.yhnc,
                        });
                      }, // 点击行
                    };
                  }}
                />
              </div>
            </div>
          </div>
        </Modal>
      </Layout>
    );
  }
}

export default connect()(Form.create()(OperatorModal));
