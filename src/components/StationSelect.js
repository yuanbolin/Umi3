// 组织机构下拉树
import React, { Component } from 'react';
import { Select } from 'antd';
import { get } from '@/utils/http';

export default class StationSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    get('sys-posts', { page: 0, size: 10000 }).then(res => {
      this.setState({
        data: res.data,
      });
    });
  }

  render() {
    const { onChange, value, mode } = this.props;
    return (
      <Select allowClear value={value} onChange={e => onChange(e)} mode={mode}>
        {this.state.data.map((item, key) => (
          <Select.Option key={item.id} value={item.id}>
            {item.postName}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
