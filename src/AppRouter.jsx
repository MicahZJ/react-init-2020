import React, { Component } from 'react'
import asyncComponent from './utils/asyncComponent'
import { Link, Route, Switch, Redirect, BrowserRouter as Router} from 'react-router-dom'

import { Layout, Menu, Breadcrumb } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
// import homePage from './views/home_page/index'
// import NavBar from './component/nav_bar/index'
// import InfoPage from './views/info_page/index'

const NavBar = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'./component/nav_bar/index'));
const MenuBar = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'./component/menu_bar/index'));
const NotFound = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'./views/404_page/index'));
const homePage = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'./views/home_page/index'));
const InfoPage = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'./views/info_page/index'));
const LoginPage = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'./views/login_page/index'));

// 配置路由鉴权
const routes = [
  {
    path: '/home',
    exact: true,
    requiresAuth: true,
    component: homePage
  },
  {
    path: '/info',
    exact: true,
    requiresAuth: true,
    component: InfoPage
  },
  {
    path: '/login',
    exact: true,
    component: LoginPage
  },
  {
    path: '/error',
    exact: true,
    component: NotFound
  },
];

export default class AppRoute extends Component {
  render () {
    let authPath = '/login';
    return (<Router>
      <Layout>
        {location.pathname !== '/error' ? <NavBar name={'nav'}/> : null}
        <Layout>
          {
            location.pathname !== '/error' ? <Sider width={256} style={{ background: 'white' }}>
              <MenuBar name={'menu'}/>
            </Sider> : null
          }
          <Layout style={{width: 'calc(100vw - 256px)', height: 'calc(100vh - 50px)'}}>
            <Switch>
              {routes.map((item, index) => <Route key={index} path={item.path} exact render={(props) => {
                let token = localStorage.getItem('token');
                // 当已经登录，并且跳转路由是login，则进入首页
                if (item.path === authPath && token) {
                  // console.log('登录页面强制跳转首页')
                  return <Redirect to={{ pathname: '/home' }} />
                }
                // 不需要验证登录的页面，当前为登录状态，路由等于login页面，则默认放行
                if (!item.requiresAuth || token || item.path === authPath) {
                  // console.log('进入正常页面', item)
                  return <item.component {...props} item={item} />
                }
                // console.log('登录失效，重定向登录页')
                return <Redirect to={{ pathname: authPath, state: { from: props.location } }} />
              }
              } />
              )}
              {/* console.log('跳转路由', location) */}
              {
                // 2.0路由规则
                // 访问根目录，跳转首页，否则进入404
                location.pathname === '/' ? <Redirect to="/home" /> : <Redirect to="/error" />
              }
              {/* 1.0路由规则 */}
              {/* 没有页面则访问首页 */}
              {/* <Redirect to="/home" />*/}
              {/* 所有错误路由跳转页面 */}
              {/* <Route component={NotFound} />*/}
            </Switch>
          </Layout>
        </Layout>
        {/* <Route exact path="/" component={homePage} />*/}
        {/* <Route exact path="/info" component={InfoPage} />*/}
      </Layout>
    </Router>)
  }
}
