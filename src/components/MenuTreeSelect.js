// 组织机构下拉树
import React, { Component } from 'react'
import { TreeSelect } from 'antd'
import { get } from '@/utils/http'

const { TreeNode } = TreeSelect

export default class MenuTreeSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      MenuTree: [],
    }
  }

  componentDidMount() {
    get('SysMenuResource/findALLMenu').then(res => {
      this.data = res.data
      this.setState({
        MenuTree: res.data,
      })
    })
  }

  componentWillUnmount() {}

  renderTree = data => {
    const mode = this.props.mode // menuCode/id    value 值为 menuCode or  id
    return data.map(item => {
      let val = item[mode].toString()
      return (
        <TreeNode key={item.id} title={item.name} value={val}>
          {item.children ? this.renderTree(item.children) : null}
        </TreeNode>
      )
    })
  }

  render() {
    const { onChange, value, treeCheckable } = this.props
    const child = this.renderTree(this.state.MenuTree)
    return (
      <TreeSelect
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        allowClear
        treeCheckable={treeCheckable} // 多选
        value={value}
        onChange={e => onChange(e)}
      >
        {child}
      </TreeSelect>
    )
  }
}
