import moment from 'moment'
import pathToRegexp from 'path-to-regexp'
import routers from '../../config/router.config'

// 通过 pathname 获取 pathname 对应到路由描述信息对象
function getTitleByPathname(path) {
  let title = ''
  const searchTit = arr => {
    for (let i = 0; i < arr.length; i++) {
      if (path.indexOf(arr[i].path) >= 0 && arr[i].routes) searchTit(arr[i].routes)
      // pathToRegexp(arr[i].path,[],{end:true});
      if (arr[i].path && pathToRegexp(arr[i].path).exec(path)) {
        title = arr[i].name
        break
      }
    }
  }
  searchTit(routers)
  return title
}

function dateToUTC(date) {
  return moment(date)
    .Of('second')
    .toISOString() // 2019-03-20T16:00:00.000Z    时分秒 取 0
}
function uTCToDate(utc_datetime) {
  return moment(utc_datetime)
    .utc()
    .utcOffset(+8)
    .format('YYYY-MM-DD HH:mm:ss')
}

function getCookie(name) {
  let arr
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)

  if (arr == document.cookie.match(reg)) return decodeURIComponent(arr[2])
  return null
}
function setCookie(name, value) {
  const Days = 30
  const exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 30)
  document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`
}

function delCookie(name) {
  const exp = new Date()

  exp.setTime(exp.getTime() - 1)

  const cval = getCookie(name)

  if (cval !== null) {
    document.cookie = `${name}=${cval};expires=${exp.toUTCString()}`
  }
}

function isLogin() {
  // if(!sessionStorage.getItem("ORG-NAME") || !sessionStorage.getItem("USER-NAME")){
  //     alert("请登录！");
  //     window.location.href = "#/";
  // }
}

/**
 * 和Table一样 需要特殊渲染添加expRender属性，参数是一行的对象
 * @param columns
 * @param dataSource
 * @param name 导出文件名
 */

function tableToCsv(columns, dataSource, name = '导出文件') {
  let str = ''
  columns.forEach(item => {
    str += `${item.title},`
  })
  str = `${str.substr(0, str.length - 1)}\n`
  dataSource.forEach(data => {
    // data是数组ds中每一个json对象
    columns.forEach(item => {
      // 对于每一个json对象需要把行列对齐
      for (const dataItem in data) {
        if (item.dataIndex === dataItem) {
          if (item.expRender) {
            str += `${`${item.expRender(data)}\t`},`
          } else {
            str += `${`${data[dataItem]}\t`},`
          }
          break
        }
      }
    })
    str += '\n'
  })
  const uri = `data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(str)}`

  // let blob = new Blob([window.atob(decodeURIComponent(uri))], {type: "text/csv"});
  // //因为后台base_64编码了,这里window.atob解码一下
  //       window.navigator.msSaveBlob(blob,name);
  //
  // 通过创建a标签实现
  const link = document.createElement('a')
  link.href = uri
  // 对下载的文件命名
  link.download = `${name}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 和Table一样 需要特殊渲染添加expRender属性，参数是一行的对象,导出xls
 * @param columns
 * @param dataSource
 * @param name 导出文件名
 */

function tableToXls(columns, dataSource, name = '导出文件') {
  let str = '<tr>'
  columns.forEach(item => {
    str += `<td>${item.title}</td>`
  })
  str += '</tr>'
  dataSource.forEach(data => {
    // data是数组ds中每一个json对象
    str += '<tr>'
    columns.forEach(item => {
      // 对于每一个json对象需要把行列对齐
      for (const dataItem in data) {
        if (item.dataIndex === dataItem) {
          if (item.expRender) {
            str += `<td>${`${item.expRender(data)}\t`}</td>`
          } else {
            str += `<td>${`${data[dataItem]}\t`}</td>`
          }
          break
        }
      }
    })
    str += '</tr>'
  })
  // Worksheet名
  const worksheet = 'Sheet1'
  const uri = 'data:application/vnd.ms-excel;base64,'

  // 下载的表格模板数据
  const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <meta charset="utf-8">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`
  // 下载模板
  window.location.href = uri + base64(template)
}
// 输出base64编码
function base64(s) {
  return window.btoa(unescape(encodeURIComponent(s)))
}

function isShowPane(auth) {
  return window.permissions && window.permissions.indexOf(auth) > -1
}

export { dateToUTC, uTCToDate, getCookie, delCookie, setCookie, isLogin, tableToCsv, tableToXls, isShowPane }
export default ''
