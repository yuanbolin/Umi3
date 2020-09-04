/*
 *作者：苑博林
 *功能：地图实例
 *时间：2020/07/29 - 15:36
 */
import React, { Component } from 'react'
import { Map, Marker } from 'react-amap';
import { Button } from 'antd';

//自定义组件
const MyMapComponent = (props) => {
  const map = props.__map__;
  if (!map) {
    console.log('组件必须作为 Map 的子组件使用');
    return;
  }
  const wrapperStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: '#fff',
    padding: '5px',
    border: '1px solid #333'
  }
  const spanStyle = {
    display: 'inline-block',
    height: '30px',
    lineHeight: '30px',
    width: '30px',
    textAlign: 'center',
    borderRadius: '50%',
    margin: '0 5px',
    cursor: 'pointer',
    background: '#333',
    color: '#fff',
    fontSize: '16px',
    border: '1px solid #333'
  }
  const zoomIn = () => map.zoomIn()
  const zoomOut = () => map.zoomOut()

  return (<div style={wrapperStyle} id="zoom-ctrl">
    <span style={spanStyle} onClick={zoomIn}>+</span>
    <span style={spanStyle} onClick={zoomOut}>-</span>
  </div>);
}

//amapUI
class AmapUI extends React.Component {
  constructor() {
    super()
    this.loadUI()
  }

  loadUI() {
    window.AMapUI.loadUI(['misc/PathSimplifier'], (PathSimplifier) => {
      this.initPath(PathSimplifier)
    })
    window.AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
      this.initPage(SimpleMarker)
    })
  }

  initPath=(PathSimplifier)=>{
    const map = this.props.__map__
    if (!PathSimplifier.supportCanvas) {
      alert('当前环境不支持 Canvas，无法显示轨迹图，建议使用Google浏览器预览');
      return;
    }
    var pathSimplifierIns = new PathSimplifier({
      zIndex: 100,
      //autoSetFitView:false,
      map: map, //所属的地图实例
      getPath: function(pathData, pathIndex) {
        return pathData.path;
      },
      getHoverTitle: function(pathData, pathIndex, pointIndex) {
        if (pointIndex >= 0) {
          //point
          return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
        }
        return pathData.name + '，点数量' + pathData.path.length;
      },
      renderOptions: {
        renderAllPointsIfNumberBelow: -1 //绘制路线节点，如不需要可设置为-1
      }
    });
    pathSimplifierIns.clearPathNavigators();
    window.pathSimplifierIns = pathSimplifierIns;
    //设置数据
    pathSimplifierIns.setData([{
      name: '轨迹0',
      path: [
        [100.340417, 27.376994],
        [108.426354, 37.827452],
        [113.392174, 31.208439],
        [124.905846, 42.232876]
      ]
    }, {
      name: '大地线',
      //创建一条包括500个插值点的大地线
      path: PathSimplifier.getGeodesicPath([116.405289, 39.904987], [87.61792, 43.793308], 500)
    }]);
    function onload() {
      pathSimplifierIns.renderLater();
    }

    function onerror(e) {
      console.log(e)
      alert('图片加载失败！');
    }
    //对第一条线路（即索引 0）创建一个巡航器
    var navg1 = pathSimplifierIns.createPathNavigator(0, {
      loop: true, //循环播放
      speed: 1000000, //巡航速度,单位千米每小时
      pathNavigatorStyle: {
        width: 24,
        height: 24,
        //使用图片
        content: PathSimplifier.Render.Canvas.getImageContent('https://webapi.amap.com/ui/1.1/ui/misc/PathSimplifier/examples/imgs/car-front.png', onload, onerror),
        strokeStyle: null,
        fillStyle: null,
        //经过路径的样式
        pathLinePassedStyle: {
          lineWidth: 6,
          strokeStyle: 'black',  //导航图层颜色
          dirArrowStyle: {
            stepSpace: 15,
            strokeStyle: 'red' //指示方向颜色
          }
        }
      }
    });

    navg1.start();

    var navg2 = pathSimplifierIns.createPathNavigator(1, {
      loop: true,
      speed: 500000,
      pathNavigatorStyle: {
        width: 24,
        height: 24,
        content: PathSimplifier.Render.Canvas.getImageContent('https://webapi.amap.com/ui/1.1/ui/misc/PathSimplifier/examples/imgs/plane.png', onload, onerror),
        strokeStyle: null,
        fillStyle: null
      }
    });

    navg2.start();
  }



  initPage(SimpleMarker) {
    const map = this.props.__map__
    // 这个例子来自官方文档 http://lbs.amap.com/api/javascript-api/guide/amap-ui/intro
    new SimpleMarker({
      //前景文字
      iconLabel: 'A',
      //图标主题
      iconTheme: 'default',
      //背景图标样式
      iconStyle: 'red',
      //...其他Marker选项...，不包括content
      map: map,
      position: [120, 31]
    })

    //创建SimpleMarker实例
    new SimpleMarker({
      //前景文字
      iconLabel: {
        innerHTML: '<i>B</i>', //设置文字内容
        style: {
          color: '#fff' //设置文字颜色
        }
      },
      //图标主题
      iconTheme: 'fresh',
      //背景图标样式
      iconStyle: 'black',
      //...其他Marker选项...，不包括content
      map: map,
      position: [120, 29]
    })
  }

  render() {
    return null
  }
}


export default class MyAmap extends React.Component {
  constructor(){
    super();
    this.state = {
      center: null
    };
    this.mapEvents = {
      created: (map) => {
        this.mapInstance = map;
        this.showCenter();
      },
      click: (e) => {
        console.log('You Clicked The Map',e)
        // 触发事件的对象
        var target = e.target;
        // 触发事件的地理坐标，AMap.LngLat 类型
        var lnglat = e.lnglat;
        // 触发事件的像素坐标，AMap.Pixel 类型
        var pixel = e.pixel;
        // 触发事件类型
        var type = e.type;
      },
      moveend: () => { this.showCenter() }
    };
    this.position = {
      longitude: 122.11553,
      latitude: 37.544966
    }
  }
  showCenter(){
    console.log(this.mapInstance.getCenter())
    this.setState({
      center: `${this.mapInstance.getCenter()}`
    });
  }
  render() {
    const plugins = [
      {
        name: 'OverView',
        options: {
          visible: true,  // 不设置该属性默认就是 true
          isOpen:true
        },
      },
    ]
    const Loading = <div style={loadingStyle}>Loading Map...</div>
    return <div style={{ width: '100%', height: '400px' }}>
      <Map  plugins={plugins} events={this.mapEvents} loading={Loading} zoom={6}  center={this.position} useAMapUI={true}>
        <Marker position={this.position} />
        <AmapUI/>
        <div className="customLayer" style={styleA}>
          <h4>自定义图层</h4>
          <p>当前中心点为: {this.state.center}</p>
        </div>
        <MyMapComponent/>
      </Map></div>
  }
}

const styleA = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  padding: '5px 10px',
  border: '1px solid #d3d3d3',
  backgroundColor: '#f9f9f9'
}

const loadingStyle = {
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize:40,
  fontWeight:'bold'
}
