// 组织机构下拉树
import React, { Component } from 'react'
import { TreeSelect } from 'antd'
import { get } from '@/utils/http'

const { TreeNode } = TreeSelect

export default class OrgTreeSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      OrganizeTree: [],
    }
  }

  componentDidMount() {
    get('sys-offices/tree').then(res => {
      this.data = res.data
      this.setState({
        OrganizeTree: res.data,
      })
    })
  }

  componentWillUnmount() {}

  renderTree = data => {
    const mode = this.props.mode // officeName/id    value 值为 officeName or  officeId
    return data.map(item => {
      return (
        <TreeNode key={item.sysOffice.id} title={item.sysOffice.officeName} value={item.sysOffice[mode]}>
          {item.children ? this.renderTree(item.children) : null}
        </TreeNode>
      )
    })
  }

  render() {
    const { onChange, value, treeCheckable } = this.props
    const options = this.renderTree(this.state.OrganizeTree)
    return (
      <TreeSelect
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        allowClear
        treeCheckable={treeCheckable} // 多选
        value={value}
        onChange={e => onChange(e)}
      >
        {options}
      </TreeSelect>
    )
  }
}
