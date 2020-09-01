import { Redirect, Route, Switch } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import asyncComponent from '../utils/AsyncComponent';

import { Layout, Menu, Breadcrumb } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const NavBar = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../component/nav_bar'));
const MenuBar = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../component/menu_bar'));
const homePage = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../views/home_page'));
const InfoPage = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../views/info_page'));
const testPage = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../views/test_page'));

const LoginPage = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../views/login_page'));
const NotFound = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../views/404_page'));


// Some folks find value in a centralized route config.
// A route config is just data. React is great at mapping
// data into components, and <Route> is a component.

// Our route config is just an array of logical "routes"
// with `path` and `component` props, ordered the same
// way you'd do inside a `<Switch>`.
import { action, observable, computed, runInAction } from 'mobx';

export default class Store {
  constructor () {
  }
  
  @observable routes = [
    {
      path: '/login',
      id: 0,
      exact: true,
      component: LoginPage,
      title: '登录',
      show: false
    },
    {
      path: '/admin',
      id: 1,
      component: Tacos,
      requiresAuth: true,
      title: '主页',
      show: true,
      children: [
        {
          path: '/admin/home',
          id: 11,
          exact: true,
          requiresAuth: true,
          component: homePage,
          title: '主页1',
        },
        {
          path: '/admin/info',
          id: 12,
          exact: true,
          requiresAuth: true,
          component: InfoPage,
          title: '主页2',
        },
      ]
    },
    {
      path: '/power',
      id: 2,
      component: Tacos,
      requiresAuth: true,
      title: '系统设置',
      show: true,
      children: [
        {
          path: '/power/test',
          id: 21,
          exact: true,
          requiresAuth: true,
          component: testPage,
          title: '系统设置1',
        },
      ]
    },
    {
      path: '/system_monitor',
      id: 3,
      component: Tacos,
      requiresAuth: true,
      title: '系统监测',
      show: true,
      children: [
        {
          path: '/system_monitor/sys_interface_log',
          id: 31,
          exact: true,
          requiresAuth: true,
          component: testPage,
          title: '系统日志',
        },
        {
          path: '/system_monitor/sys_login_log',
          id: 32,
          exact: true,
          requiresAuth: true,
          component: testPage,
          title: '登录日志',
        },
        {
          path: '/system_monitor/sys_info',
          id: 33,
          exact: false,
          requiresAuth: true,
          title: '系统信息',
          show: true,
          children: [
            {
              path: '/system_monitor/sys_info/jvm_info',
              id: 331,
              exact: true,
              requiresAuth: true,
              component: testPage,
              title: 'Jvm日志',
            },
          ]
        },
      ]
    },
    {
      path: '/error',
      id: 3,
      exact: true,
      requiresAuth: true,
      component: NotFound,
      title: '错误404',
      show: false
    }
  ];
  
  // @action changeNav (e) {
  //   this.current = e
  //   console.log('click ', this.current);
  // }
  
  // @computed get c () {
  // }
  
}
// 配置路由鉴权
function Tacos({ routes }) {
  return (
    <Layout style={{ height: '100vh', overflow: 'hidden'}}>
      <Sider width={256} style={{ background: 'white' }} collapsible>
        <MenuBar name={'menu'} router={routes}/>
      </Sider>
      <Layout className="site-layout" style={{ height: '100%', overflow: 'hidden'}}>
        <NavBar name={'nav'}/>
        <Content
          style={{
            height: 'calc(100vh - 200px)'
          }}
        >
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route}/>
            ))}
            <Redirect to={{ pathname: routes[0].path }} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
}

// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
export const RouteWithSubRoutes = (route) => {
  let authPath = '/login';
  return (
    <Route
      path={route.path}
      render={(props) => {
        let token = localStorage.getItem('token');
        
        // 当已经登录，并且跳转路由是login，则进入首页
        if (route.path === authPath && token) {
          console.log('登录页面强制跳转首页')
          return <Redirect to={{ pathname: '/admin/home' }} />
        }
        // 不需要验证登录的页面，当前为登录状态，路由等于login页面，则默认放行
        if (!route.requiresAuth || token || route.path === authPath) {
          // 子组件需要递归
          if (route.children && route.children.length > 0 && !route.component) {
            console.log('进入子页面', route);
            // return <RouteWithSubRoutes {...route.children[0]}/>
            return <Recursion {...route}/>
          }
          
          console.log('进入正常页面', route, props)
          return <route.component {...props} routes={route.children} />
        }
        console.log('登录失效，重定向登录页')
        return <Redirect to={{ pathname: authPath }} />
      }}
    />
  );
};

// 递归二级以下的路由
let Recursion = (route) => (
  <Switch>
    {route.children.map((route, i) => {
      console.log('递归路由', route);
      if (route.children && route.children.length > 0) {
        return <Recursion {...route}/>
      } else {
        return <RouteWithSubRoutes key={i} {...route}/>
      }
    })}
    <Redirect to={{ pathname: route.children[0].path }} />
  </Switch>
);


Tacos.propTypes = {
  routes: PropTypes.array,
};
