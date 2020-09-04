// 通过 pathname 获取 pathname 对应到路由描述信息对象
import pathToRegexp from 'path-to-regexp';
import routers from '../../../config/router.config';
const getTitleByPathname = path => {
  let title = '404';
  const searchTit = arr => {
    for (let i = 0; i < arr.length; i++) {
      if (path.indexOf(arr[i].path) >= 0 && arr[i].routes)
        searchTit(arr[i].routes);
      if (arr[i].path && pathToRegexp(arr[i].path).exec(path)) {
        title = arr[i].name ? arr[i].name : '404';
        break;
      }
    }
  };
  searchTit(routers);
  return title;
};



export {getTitleByPathname}
