import { getTitleByPathname } from '../components/RouterTabs/getTitleByPathname'
function getInitStateFromSessionStorage() {
  return sessionStorage.getItem('ROUTER_TABS_DVA')
    ? JSON.parse(sessionStorage.getItem('ROUTER_TABS_DVA'))
    : {
        currentPath: '', // 当前路由对应到 pathname
        refsTag: [], // tabs 所有页签};
      }
}

export default {
  namespace: 'routerTabs',
  state: getInitStateFromSessionStorage(),
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname === '/' || pathname === '/login') return
        if (!getTitleByPathname(pathname) || getTitleByPathname(pathname) === '404') return // router没有name属性。不新增tab
        dispatch({ type: 'handleUrlChange', payload: { pathname } })
      })
    },
  },
  effects: {
    *handleUrlChange(action, { put, select }) {
      const { pathname } = action.payload
      const refsTag = yield select(state => state.routerTabs.refsTag)
      const currentPathname = pathname
      //检查原来有没有相同title 的标签( 不能有相同title 的tag 原因： 用户在两个相同tag 页面之间点击切换页面时，页面url改变但是不刷新
      if (refsTag.indexOf(currentPathname) === -1) {
        const tit = getTitleByPathname(currentPathname)
        let theIndex = -1
        refsTag.forEach((item, index) => {
          theIndex = getTitleByPathname(item) === tit ? index : -1
        })
        if (theIndex !== -1) {
          refsTag[theIndex] = currentPathname
        } else {
          refsTag.push(currentPathname)
        }
      }
      yield put({ type: 'save', payload: { currentPath: pathname, refsTag } })
    },
  },
  reducers: {
    save(state, action) {
      const newState = { ...state, ...action.payload }
      sessionStorage.setItem('ROUTER_TABS_DVA', JSON.stringify(newState))
      return newState
    },
    closePage(state, { payload }) {
      const closePagePath = payload.closePath
      let newrefsTag = [...state.refsTag.filter(item => item !== closePagePath)]
      const newState = { ...state, refsTag: newrefsTag }
      sessionStorage.setItem('ROUTER_TABS_DVA', JSON.stringify(newState))
      //删除页面的信息
      sessionStorage.setItem(`${closePagePath}-close`, 'true')
      sessionStorage.removeItem(`${closePagePath}-state`)
      sessionStorage.removeItem(`${closePagePath}-form`)
      sessionStorage.removeItem(`${closePagePath}-siderBar`)
      return newState
    },
  },
}
