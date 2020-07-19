import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import { Layout, Menu, Breadcrumb } from 'antd';
import asyncComponent from '../utils/asyncComponent';
import PropTypes from 'prop-types';
import CommentLoginPage from '../views/login_page';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const NavBar = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../component/nav_bar'));
const MenuBar = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../component/menu_bar'));
const homePage = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../views/home_page'));
const InfoPage = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../views/info_page'));

const LoginPage = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../views/login_page/index'));
const NotFound = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'../views/404_page/index'));

// Some folks find value in a centralized route config.
// A route config is just data. React is great at mapping
// data into components, and <Route> is a component.

// Our route config is just an array of logical "routes"
// with `path` and `component` props, ordered the same
// way you'd do inside a `<Switch>`.
// 配置路由鉴权
const routes = [
  {
    path: '/login',
    exact: true,
    component: LoginPage
  },
  {
    path: '/admin',
    component: Tacos,
    requiresAuth: true,
    children: [
      {
        path: '/admin/home',
        exact: true,
        requiresAuth: true,
        component: homePage
      },
      {
        path: '/admin/info',
        exact: true,
        requiresAuth: true,
        component: InfoPage
      },
      {
        path: '/admin/test',
        exact: true,
        requiresAuth: true,
        component: NotFound
      }
    ]
  },
  {
    path: '/edit',
    component: Tacos,
    requiresAuth: true,
    children: [
      {
        path: '/edit/test',
        exact: true,
        requiresAuth: true,
        component: NotFound
      }
    ]
  },
  {
    path: '/error',
    exact: true,
    requiresAuth: true,
    component: NotFound
  }
];

export default class AppRoute extends Component {
  render () {
    let authPath = '/login';
  
    return (
      <Router>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
          <Redirect to={{ pathname: authPath }} />
        </Switch>
      </Router>
    );
  }
}

// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
function RouteWithSubRoutes(route) {
  let authPath = '/login';
  
  return (
    <Route
      path={route.path}
      render={(props) => {
        let token = localStorage.getItem('token');
  
        // 当已经登录，并且跳转路由是login，则进入首页
        if (route.path === authPath && token) {
          // console.log('登录页面强制跳转首页')
          return <Redirect to={{ pathname: '/admin/home' }} />
        }
        // 不需要验证登录的页面，当前为登录状态，路由等于login页面，则默认放行
        if (!route.requiresAuth || token || route.path === authPath) {
          // console.log('进入正常页面', route)
          return <route.component {...props} routes={route.children} />
        }
        // console.log('登录失效，重定向登录页')
        return <Redirect to={{ pathname: authPath }} />
      }}
    />
  );
}

function Tacos({ routes }) {
  return (
    <Layout>
      <NavBar name={'nav'}/>
      <Layout>
        <Sider width={256} style={{ background: 'white' }}>
          <MenuBar name={'menu'}/>
        </Sider>
        <Layout style={{width: 'calc(100vw - 256px)', height: 'calc(100vh - 50px)'}}>
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
            <Redirect to={{ pathname: routes[0].path }} />
          </Switch>
        </Layout>
      </Layout>
    </Layout>
  );
}

Tacos.propTypes = {
  routes: PropTypes.array,
};
