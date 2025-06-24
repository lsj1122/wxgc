import { asyncRoutes, constantRoutes } from '@/router'
import { fetchOneLevelRouterMenu} from '@/api/sysRouterMenu'

/* Layout */
import Layout from '@/layout'
import childrenView from '@/layout/childrenView'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }

    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children, roles)
      if(tmp.children&& tmp.children.length>0){
        res.push(tmp)
      }
    }else{
      if(hasPermission(roles, tmp)){
        res.push(tmp)
      }
    }
    /*if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }*/
  })
  return res
}

const state = {
  routes: [],
  addRoutes: [],
  myDbroutes:[], //我的路由，过滤后的路由
}


const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_MY_DB_ROUTES: (state, routes) => {
    //深度copy一个数字防止被改动
    state.myDbroutes = JSON.parse(JSON.stringify(routes));
    //将隐藏的改为可见
    changeRoutesToShow(state.myDbroutes);
  }
}

function changeRoutesToShow(routes) {
  routes.forEach(route => {
    route.hidden=false;
    if (route.children&& route.children.length>0) {
      changeRoutesToShow(route.children)
    }
  })
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes

      /**
       * 从数据库中读取路由列表数据
       * @type {Array}
       */
      fetchOneLevelRouterMenu().then(response=>{
        let  dbRouters=response.data;

          accessedRoutes = dbRouters || []
          //过滤角色数据
          accessedRoutes =  filterAsyncRoutes(accessedRoutes, roles)
          //提交更新
          commit('SET_MY_DB_ROUTES', accessedRoutes)
          //初始化组件
          importVueComponent(accessedRoutes);
          //提交更新
          commit('SET_ROUTES', accessedRoutes)

          accessedRoutes.push({
              path: "*",
              redirect: "/404",
              hidden: true
          })
          resolve(accessedRoutes)
      }).catch(error => {
        console.log(error)
      })
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}




//加载Vue组件（数据库中存储的是@view下的路径）
function  importVueComponent(dbRouters) {
  for(let obj of dbRouters){
    delete obj.id;

    for(let key in obj){
      if(obj[key]==null){
        delete obj[key];
      }
    }
    //懒加载view下的组件
    if(obj.component.startsWith("/")){
      obj.component = loadViewsComp(obj.component)
    //懒加载自定义路径下的组件
    }else if(obj.component.startsWith("@")||obj.component.startsWith("../")||obj.component.startsWith("./")){
      obj.component= loadCustomComp(obj.component)
    //加载Layout布局
    }else if(obj.component=="Layout"){
      obj.component= Layout
    }else if(obj.component=="childrenView"){
      obj.component= childrenView
    }
    if(obj.children&&obj.children.length>0){
      importVueComponent(obj.children)
    }
  }
}

//主要解决 import中不能使用变量
function loadViewsComp(path) {
  return (resolve) => require([`@/views${path}`], resolve)
}
function loadCustomComp(path) {
  return (resolve) => require([`${path}`], resolve)
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
