/*
 *作者：苑博林
 *功能：渐变象形图实例
 *时间：2020/07/29 - 15:36
 */
import React, { Component } from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pictorialBar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

export default class componentName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      BarOption: {},
      list: []
    }
  }

  componentDidMount() {
    let { type, params, data } = this.props
    if (type == '器材装备') {
      this.qicaiBar(JSON.parse(params))
      this.setState({
        list: data
      })
    }
  }

  onclick = {
    click: this.clickEchartsPie.bind(this)
  }

  clickEchartsPie = e => {
    // console.log(e)
  }

  formatterTip = params => {
    let temp = []
    this.state.list &&
      this.state.list.length > 0 &&
      this.state.list.map(item => {
        if (params.name === item.xingming) {
          temp = item.xiaolei
        }
      })

    let tip = ''
    for (let i = 0; i < temp.length; i++) {
      //这里是自己定义样式， params[i].marker 表示是否显示左边的那个小圆圈
      if (temp[i].value != 0) {
        tip = `${tip + temp[i].name}:${temp[i].value}<br/>`
      }
    }

    return tip
  }

  qicaiBar = params => {
    let THE = this
    //象形柱状图
    let spirit =
      "background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYxREQwQzI4NzI2QTExRUE5RkRFQTY1QThCNjdGODIxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYxREQwQzI5NzI2QTExRUE5RkRFQTY1QThCNjdGODIxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjFERDBDMjY3MjZBMTFFQTlGREVBNjVBOEI2N0Y4MjEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjFERDBDMjc3MjZBMTFFQTlGREVBNjVBOEI2N0Y4MjEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6KvM4GAAAAG0lEQVR42mL8//8/AzpgYsACRgVHBaklCBBgAKFXAzkRMtjgAAAAAElFTkSuQmCC');"
    // this.myChart = echarts.init(document.getElementById('doms'));
    let option = {
      tooltip: {
        trigger: 'item',
        // formatter: '{a} <br/>{b} : {c} ({d}%)'
        // formatter: `${options}`
        // eslint-disable-next-line no-shadow
        formatter(params) {
          //提示框自定义
          return THE.formatterTip(params)
        },
        // eslint-disable-next-line no-shadow
        position(point, params, dom, rect, size) {
          // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
          // 提示框位置
          let x = 0 // x坐标位置
          let y = 0 // y坐标位置

          // 当前鼠标位置
          let pointX = point[0]
          let pointY = point[1]

          // 外层div大小
          // var viewWidth = size.viewSize[0];
          // var viewHeight = size.viewSize[1];

          // 提示框大小
          let boxWidth = size.contentSize[0]
          let boxHeight = size.contentSize[1]

          // boxWidth > pointX 说明鼠标左边放不下提示框
          if (boxWidth > pointX) {
            x = 5
          } else {
            // 左边放的下
            x = pointX - boxWidth
          }

          // boxHeight > pointY 说明鼠标上边放不下提示框
          if (boxHeight > pointY) {
            y = 5
          } else {
            // 上边放得下
            y = pointY - boxHeight
          }

          return [x, y]
        }
      },
      backgroundColor: params.backgroundColor, //背景色
      xAxis: {
        max: params.maxData,
        splitLine: { show: false },
        offset: 10,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        data: params.label,
        inverse: true,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          margin: 10,
          color: 'rgb(1,240,252)',
          fontSize: 16
        }
      },
      grid: {
        top: 'center',
        height: 250,
        left: 70,
        right: 100
      },
      series: [
        {
          type: 'bar',
          barWidth: 15,
          // barGap: '80%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: 'rgb(0,240,255)' }, { offset: 1, color: 'rgb(253,224,131)' }])
            }
          },
          data: params.data,
          z: 0
        },
        {
          type: 'pictorialBar',
          symbol: spirit,
          barGap: '-100%',
          symbolSize: [2.5, 15],
          z: 2,
          symbolMargin: '80%', //间隔
          itemStyle: {
            //图形样式
            normal: {
              color: params.backgroundColor //’#101634’
            }
          },
          data: params.data,
          symbolBoundingData: params.maxData,
          symbolRepeat: 'fixed',
          symbolClip: true
        },
        {
          // full data
          type: 'pictorialBar',
          itemStyle: {
            normal: {
              //柱形图圆角，初始化效果
              color: 'rgba(255,255,255,0.2)'
            }
          },
          label: {
            show: true,
            // eslint-disable-next-line no-shadow
            formatter(params) {
              return `( ${params.value}件 )`
            },
            position: 'right',
            offset: [10, 0],
            color: 'rgb(1,240,252)',
            fontSize: 16
          },
          animationDuration: 0,
          symbolRepeat: 'fixed',
          symbolMargin: '80%',
          symbol: 'rect',
          symbolSize: [2.5, 15],
          symbolBoundingData: params.maxData,
          data: params.data,
          z: 1
        }
      ]
    }
    this.setState({
      BarOption: option
    })
    // this.myChart.clear();
    // this.myChart.setOption(option);
    // window.addEventListener('resize', function () {this.myChart.resize();})
    // this.myChart.on('click',(parmas)=>{
    //   console.log(params)
    // })
  }

  render() {
    return (
      <ReactEchartsCore
        style={this.props.heighttemp === 'auto' ? {} : { height: this.props.heighttemp }}
        echarts={echarts}
        option={this.state.BarOption}
        onEvents={this.onclick}
        id='doms'
      />
    )
  }
}
