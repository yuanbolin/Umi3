import React, { Component } from 'react'
import { TreeSelect } from 'antd'
import { get } from '@/utils/http'

const { TreeNode } = TreeSelect

export default class CompanyTreeSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      companyTree: [],
    }
  }

  componentDidMount() {
    get('sys-companys/tree').then(res => {
      this.data = res.data
      this.setState({
        companyTree: res.data,
      })
    })
  }

  componentWillUnmount() {}

  renderTree = data => {
    const mode = this.props.mode // companyName/id/companyCode    value 值为 companyName or  id  or companyCode
    return data.map(item => {
      return (
        <TreeNode key={item.sysCompany.id} title={item.sysCompany.companyName} value={item.sysCompany[mode]}>
          {item.children ? this.renderTree(item.children) : null}
        </TreeNode>
      )
    })
  }

  render() {
    const { onChange, value } = this.props
    const option = this.renderTree(this.state.companyTree)
    return (
      <TreeSelect dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} allowClear value={value} onChange={e => onChange(e)}>
        {option}
      </TreeSelect>
    )
  }
}
