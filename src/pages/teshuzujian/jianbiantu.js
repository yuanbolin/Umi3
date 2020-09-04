import React, { Component } from 'react'

import Xiangxingtu from '../components/xiangxingtu'

export default class componentName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      qicaiBarParams: {
        backgroundColor: 'rgb(9,8,68)', //背景色
        data: [1,2,3,4,5],
        label: ['张三','李四','王五','薛六','贾七'],
        maxData: 20
      },
      qicaiData: [{
        xingming:'张三',
        shuliang:10,
        xiaolei:[{
          leibie:'赵明磊',
          name:'强光灯',
          value:14
        }]
      },
        {
          xingming:'李四',
          shuliang:10,
          xiaolei:[{
            leibie:'赵明磊',
            name:'强光灯',
            value:2
          }]
        },
        {
          xingming:'王五',
          shuliang:10,
          xiaolei:[{
            leibie:'赵明磊',
            name:'强光灯',
            value:5
          }]
        },
        {
          xingming:'薛六',
          shuliang:10,
          xiaolei:[{
            leibie:'赵明磊',
            name:'强光灯',
            value:13
          }]
        },
        {
          xingming:'贾七',
          shuliang:10,
          xiaolei:[{
            leibie:'赵明磊',
            name:'强光灯',
            value:12
          }]
        }]
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <Xiangxingtu type='器材装备' params={JSON.stringify(this.state.qicaiBarParams)} data={this.state.qicaiData} heighttemp='60%' />
    )
  }
}
