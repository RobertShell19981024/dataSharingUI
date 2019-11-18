import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/authredirect', component: _import('login/authredirect'), hidden: true},
  {path: '/404', component: _import('errorPage/404'), hidden: true},
  {path: '/401', component: _import('errorPage/401'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: '首页',
      meta: {title: 'dashboard', icon: 'dashboard', noCache: true}
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export const asyncRouterMap = [{
  path: '/baseManager',
  component: Layout,
  name: '基础配置管理',
  icon: 'setting',
  authority: 'baseManager',
  children: [{
    path: 'userManager',
    icon: 'fa-user',
    component: _import('admin/user/index'),
    name: '用户管理',
    authority: 'userManager'
  }, {
    path: 'menuManager',
    icon: 'category',
    component: _import('admin/menu/index'),
    name: '菜单管理',
    authority: 'menuManager'
  }, {
    path: 'groupManager',
    icon: 'group_fill',
    component: _import('admin/group/index'),
    name: '角色权限管理',
    authority: 'groupManager'
  }, {
    path: 'groupTypeManager',
    icon: 'fa-users',
    component: _import('admin/groupType/index'),
    name: '角色类型管理',
    authority: 'groupTypeManager'
  }, {
    path: 'gateLogManager',
    icon: 'viewlist',
    component: _import('admin/gateLog/index'),
    name: '操作日志管理',
    authority: 'gateLogManager'
  }, {
    path: 'dictManager',
    icon: 'viewlist',
    component: _import('dict/index'),
    name: '数据字典',
    authority: 'dictManager'
  }, {
    path: 'tenantManager',
    icon: 'tenant',
    component: _import('admin/tenant/index'),
    name: '租户管理',
    authority: 'tenantManager'
  }, {
    path: 'jobManager',
    icon: 'tenant',
    component: _import('admin/job/index'),
    name: '定时任务管理',
    authority: 'jobManager'
  }]
}, {
  path: '/orgManager',
  component: Layout,
  name: '部门组织管理',
  icon: 'setting',
  authority: 'orgManager',
  children: [{
    path: 'departManager',
    component: _import('org/depart/index'),
    name: '服务权限管理',
    authority: 'departManager'
  }]
}, {
  path: '/authManager',
  component: Layout,
  name: '服务管理',
  icon: 'setting',
  authority: 'authManager',
  children: [{
    path: 'serviceManager',
    component: _import('auth/service/index'),
    name: '服务权限管理',
    authority: 'serviceManager'
  }, {
    path: 'apiManager',
    component: _import('auth/api/index'),
    name: '服务接口管理',
    authority: 'apiManager'
  }, {
    path: 'gatewayManager',
    component: _import('auth/gatewayRoute/index'),
    name: '网关路由管理',
    authority: 'gatewayManager'
  }, {
    path: 'oauthClientDetailsManager',
    component: _import('auth/oauthClientDetails/index'),
    name: 'OAuth客户端管理',
    authority: 'oauthClientDetailsManager'
  }]
}, {
  path: '/monitorManager',
  component: Layout,
  name: '监控模块管理',
  icon: 'setting',
  authority: 'monitorManager',
  children: [{
    path: 'serviceEurekaManager',
    component: _import('monitor/eureka/index'),
    name: 'Eureka注册中心',
    authority: 'serviceEurekaManager'
  }, {
    path: 'serviceMonitorManager',
    component: _import('monitor/service/index'),
    name: '服务状态监控',
    authority: 'serviceMonitorManager'
  }, {
    path: 'serviceZipkinManager',
    component: _import('monitor/zipkin/index'),
    name: '服务链路监控',
    authority: 'serviceZipkinManager'
  }, {
    path: 'blackIpManager',
    component: _import('monitor/blackIpManager/index'),
    name: 'IP黑名单管理',
    authority: 'blackIpManager'
  }, {
    path: 'unifiedApisManage',
    component: _import('monitor/unifiedApisManage/index'),
    name: '统一接口管理',
    authority: 'unifiedApisManage'
  }, {
    path: 'ipMappingInfoManager',
    component: _import('monitor/ipMappingInfo/index'),
    name: 'IP地址映射信息',
    authority: 'ipMappingInfoManager'
  }]
}, {
  path: '/appManager',
  component: Layout,
  name: '会员管理模块',
  icon: 'setting',
  authority: 'appManager',
  children: [{
    path: 'appUserManager',
    component: _import('app/appUser/index'),
    name: '会员账户管理',
    authority: 'appUserManager'
  }]
}, {
  path: '/baseInfoManage',
  component: Layout,
  name: '基础信息管理',
  icon: 'setting',
  authority: 'baseInfoManage',
  children: [{
    path: 'corpInfoManage',
    component: _import('baseInfo/corpInfo/index'),
    name: '机构信息管理',
    authority: 'corpInfoManage'
  }, {
    path: 'secretInfoManage',
    component: _import('baseInfo/secretInfo/index'),
    name: '密钥信息管理',
    authority: 'secretInfoManage'
  }, {
    path: 'sdkDownloadManage',
    component: _import('baseInfo/sdkDownload/index'),
    name: 'SDK下载管理',
    authority: 'sdkDownloadManage'
  }, {
    path: 'allInterfaceInfo',
    component: _import('baseInfo/allInterfaceInfo/index'),
    name: '接口信息总览',
    authority: 'allInterfaceInfo'
  }]
}, {
  path: '/businessProcessManage',
  component: Layout,
  name: '业务流程管理',
  icon: 'setting',
  authority: 'businessProcessManage',
  children: [{
    path: 'businessProcessConfig',
    component: _import('businessProcess/businessProcessConfig/index'),
    name: '业务流程配置',
    authority: 'businessProcessConfig'
  }, {
    path: 'businessProcessDoc',
    component: _import('businessProcess/businessProcessDoc/index'),
    name: '业务流程文档',
    authority: 'businessProcessDoc'
  }, {
    path: 'businessProcessMonitor',
    component: _import('businessProcess/businessProcessMonitor/index'),
    name: '业务流程监控',
    authority: 'businessProcessMonitor'
  }]
}, {
  path: '/interfaceServiceManage',
  component: Layout,
  name: '接口服务管理',
  icon: 'setting',
  authority: 'interfaceServiceManage',
  children: [{
    path: 'sendServiceConfig',
    component: _import('interfaceService/sendServiceConfig/index'),
    name: '发布接口配置',
    authority: 'sendServiceConfig'
  }, {
    path: 'sendServiceDoc',
    component: _import('interfaceService/sendServiceDoc/index'),
    name: '发布接口文档',
    authority: 'sendServiceDoc'
  }, {
    path: 'accessServiceManage',
    component: _import('interfaceService/accessServiceManage/index'),
    name: '对接接口管理',
    authority: 'accessServiceManage'
  }, {
    path: 'accessServiceDoc',
    component: _import('interfaceService/accessServiceDoc/index'),
    name: '对接接口文档',
    authority: 'accessServiceDoc'
  }, {
    path: 'serviceDataManage',
    component: _import('interfaceService/serviceDataManage/index'),
    name: '接口数据管理',
    authority: 'serviceDataManage'
  }, {
    path: 'serviceTestOnline',
    component: _import('interfaceService/serviceTestOnline/index'),
    name: '接口在线测试',
    authority: 'serviceTestOnline'
  }]
}, {
  path: '/noticeManage',
  component: Layout,
  name: '通知管理',
  icon: 'setting',
  authority: 'noticeManage',
  children: [{
    path: 'noticeBaseInfoManage',
    component: _import('baseInfo/noticeBaseInfo/index'),
    name: '通知基础配置',
    authority: 'noticeBaseInfoManage'
  }, {
    path: 'noticeCorpManage',
    component: _import('notice/noticeCorpManage/index'),
    name: '通知机构管理',
    authority: 'noticeCorpManage'
  }, {
    path: 'noticeDataManage',
    component: _import('notice/noticeDataManage/index'),
    name: '通知数据管理',
    authority: 'noticeDataManage'
  }, {
    path: 'noticeSender',
    component: _import('notice/noticeSender/index'),
    name: '通知的发送方',
    authority: 'noticeSender'
  }]
}, {
  path: '/countManage',
  component: Layout,
  name: '统计管理',
  icon: 'setting',
  authority: 'countManage',
  children: [{
    path: 'serviceAccessCount',
    component: _import('count/serviceAccessCount/index'),
    name: '接口访问统计',
    authority: 'serviceAccessCount'
  }, {
    path: 'noticeDataCount',
    component: _import('count/noticeDataCount/index'),
    name: '通知数据统计',
    authority: 'noticeDataCount'
  }]
}, {
  path: '/interfaceManager',
  component: Layout,
  name: '接口管理',
  icon: 'setting',
  authority: 'interfaceManager',
  children: [{
    path: 'pathConfig',
    component: _import('interface/pathConfig/index'),
    name: '路径配置',
    authority: 'pathConfig'
  }, {
    path: 'visitInterfaceManage',
    component: _import('interface/visitInterfaceManage/index'),
    name: '访问接口管理',
    authority: 'visitInterfaceManage'
  }, {
    path: 'myPublicInterface',
    component: _import('interface/myPublicInterface/index'),
    name: '我的接口管理',
    authority: 'myPublicInterface'
  }, {
    path: 'interfaceMonitor',
    component: _import('interface/interfaceMonitor/index'),
    name: '接口监控',
    authority: 'interfaceMonitor'
  }]
},
  {
    path: '/myDzManage',
    component: Layout,
    name: '我的定制',
    icon: 'setting',
    authority: 'myDzManage',
    children: [{
      path: 'DzConfig',
      component: _import('myDz/DzConfig/index'),
      name: '定制配置',
      authority: 'DzConfig'
    }]
  },
  {
    path: '/myInterface',
    component: Layout,
    name: '我的接口',
    icon: 'setting',
    authority: 'myInterface',
    children: [{
      path: 'myPublicInterface',
      component: _import('myInterface/myPublicInterface/index'),
      name: '我的发布接口',
      authority: 'myPublicInterface'
    },
      {
        path: 'myDzInterface',
        component: _import('myInterface/myDzInterface/index'),
        name: '我的定制接口',
        authority: 'myDzInterface'
      },
      {
        path: 'myRequestInterface',
        component: _import('myInterface/myRequestInterface/index'),
        name: '我的请求接口',
        authority: 'myRequestInterface'
      }, {
        path: 'nationalInterfaceConfig',
        component: _import('myInterface/nationalInterfaceConfig/index'),
        name: '国家级接口访问配置',
        authority: 'nationalInterfaceConfig'
      },
      {
        path: 'onlineTest',
        component: _import('myInterface/onlineTest/index'),
        name: '在线测试',
        authority: 'onlineTest'
      },{
        path: 'requestInterface',
        component: _import('myInterface/requestInterface/index'),
        name: '请求接口',
        authority: 'requestInterface'
      }]
  }, {
    path: '/interfaceManage',
    component: Layout,
    name: '接口管理',
    icon: 'setting',
    authority: 'interfaceManage',
    children: [{
      path: 'publicInterfaceManage',
      component: _import('interfaceManage/publicInterfaceManage/index'),
      name: '发布接口管理',
      authority: 'publicInterfaceManage'
    }, {
      path: 'requestInterfaceManage',
      component: _import('interfaceManage/requestInterfaceManage/index'),
      name: '请求接口管理',
      authority: 'requestInterfaceManage'
    },]
  },{
    path: '/journalManage',
    component: Layout,
    name: '日志管理',
    icon: 'setting',
    authority: 'journalManage',
    children: [{
      path: 'journalSearch',
      component: _import('journalManage/journalSearch/index'),
      name: '日志查询',
      authority: 'journalSearch'
    }]
  }
];
