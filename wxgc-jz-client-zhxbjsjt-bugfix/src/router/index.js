import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
* 翻译的解释
* 注意：子菜单仅在路由children.length> = 1时出现
* 详细信息请参见：https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*
* hidden: true 如果设置为true，则项目不会显示在边栏中（默认为false）
* alwaysShow: true  如果设置为true，则将始终显示根菜单
*                   如果未设置alwaysShow，则当项具有多个子路线时，
*                   它将变为嵌套模式，否则不显示根菜单
* redirect：noRedirect 如果设置了noRedirect将不会在面包屑中重定向
* name：'router-name'， 该名称由<keep-alive>使用（必须设置！！！）
* meta：{
    roles: ['admin','editor']       控制页面角色（您可以设置多个角色）
    title：'title'                  名称显示在侧边栏和面包屑中（推荐设置）
    icon: 'svg-name'/'el-icon-x'    图标显示在侧栏中
    noCache: true                   如果设置为true，则不缓存页面（默认为false）
    affix：true                     如果设置为true，标签将粘贴在标签视图中
    breadcrumb: false               如果设置为false，则该项将隐藏在面包屑中（默认值为true）
    activeMenu：'/example/list'     如果设置了路径，边栏将突出显示您设置的路径
}
*/

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * (没有权限要求的基页)
 * all roles can be accessed
 * (所有的路由都能访问)
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/mobile",
    component: () => import("@/views/mobile/index"),
    hidden: true,
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true,
  },
  // 企业级大屏
  {
    path: "/newEnterprise",
    component: () => import("@/views/viewPlate/newEnterprise/layout"),
    hidden: true,
  },
  {
    path: "/markdown",
    component: () => import("@/views/markdown/index"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: { title: "dashboard", icon: "dashboard", affix: true },
      },
    ],
  },
  {
    path: "/profile",
    component: Layout,
    redirect: "/profile/index",
    hidden: true,
    children: [
      {
        path: "index",
        component: () => import("@/views/profile/index"),
        name: "Profile",
        meta: { title: "profile", icon: "user", noCache: true },
      },
    ],
  },
  {
    path: "/demo",
    component: () => import("@/components/BLKUI/BIMFACE/index.vue"),
    hidden: true,
  },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 * (需要根据用户角色动态加载的路由)
 * 默认写死的数据
 */

export const asyncRoutes = [];

const createRouter = () =>
  new Router({
    mode: "history", // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
