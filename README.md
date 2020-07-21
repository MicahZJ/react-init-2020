## 配置 aes加密
### 创建类
```
import CryptoJS from 'crypto-js';
class CryptoFile {
  constructor () {
    // 秘钥
    this.key = CryptoJS.enc.Utf8.parse('CRYPTOJSKEY00000'); // 16位
    this.iv = CryptoJS.enc.Utf8.parse('CRYPTOJSKEY00000');
    this.CRYPTOJSKEY = 'CRYPTOJSKEY'
  }
  // 加密
  encrypt(word) {
    let srcS = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcS, this.key, { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
  }
  
  // 解密
  decrypt(word) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcS = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcS, this.key, { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    // eslint-disable-next-line no-debugger
    // debugger
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }
}
export default new CryptoFile()
```
### 在拦截器内使用类
```
import crypto from './crypto';

const $http = (url = '', data = {}, type = 'GET', _config = {}) => new Promise((resolve, reject) => {
  type = type.toUpperCase();
  const config = Object.assign(_config, {
    method: type,
    url: url
  });
  // get请求走正常
  if (['GET'].includes(type)) {
    config.params = crypto.encrypt(JSON.stringify(data));
  } else { // post增加请求头
    Object.assign(config, {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token')
      }
    });
    
    // 封装Data => FormData
    // const formdata = new FormData();
    // for (let key in data) {
    //   formdata.append(key, data[key]);
    // }
    config.data = crypto.encrypt(JSON.stringify(data));
    // console.log('解密', config.data, JSON.parse(crypto.decrypt(config.data)))
  }
```
## 2020-07-14 配置路由鉴权
### 配置AppRouter.jsx
配置路由数组，用来存储路由数据
```
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
    ]
  },
  {
    path: '/power',
    component: Tacos,
    requiresAuth: true,
    children: [
      {
        path: '/power/test',
        exact: true,
        requiresAuth: true,
        component: testPage
      },
    ]
  },
  {
    path: '/error',
    exact: true,
    requiresAuth: true,
    component: NotFound
  }
];
```
### 通过antd layout布局配置页面
导入组件
```
import { Layout, Menu, Breadcrumb } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
```
配置路由
```
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
          console.log('登录页面强制跳转首页')
          return <Redirect to={{ pathname: '/admin/home' }} />
        }
        // 不需要验证登录的页面，当前为登录状态，路由等于login页面，则默认放行
        if (!route.requiresAuth || token || route.path === authPath) {
          console.log('进入正常页面', route)
          return <route.component {...props} routes={route.children} />
        }
        console.log('登录失效，重定向登录页')
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

```
## 2020-07-10 配置axios
### 下包
```
npm i -S axios
```
### 封装axios请求
在utils文件下新建Http.js
```
import axios from 'axios';
import React, { Component } from 'react';
import webConfig from './web_config'
import ReactDOM from 'react-dom';
import { message, Spin } from 'antd';

// 设置请求路径
axios.defaults.baseURL = webConfig.rootUrl;
axios.defaults.withCredentials = true;

// 设置post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 当前正在请求的数量
let requestCount = 0

// 全局显示loading
function showLoading () {
  if (requestCount === 0) {
    let dom = document.createElement('div')
    dom.setAttribute('id', 'loading')
    dom.style.position = 'fixed';
    dom.style.top = '0px';
    dom.style.left = '0px';
    dom.style.background = 'rgba(0, 0, 0, 0.4)';
    dom.style.display = 'flex';
    dom.style.justifyContent = 'center';
    dom.style.alignItems = 'center';
    dom.style.width = '100vw';
    dom.style.height = '100vh';
    document.body.appendChild(dom)
    ReactDOM.render(<Spin tip="数据请求中，请稍后..." size="large"/>, dom)
  }
  requestCount++
}

// 隐藏loading
function hideLoading () {
  requestCount--
  if (requestCount === 0) {
    document.body.removeChild(document.getElementById('loading'))
  }
}

// 请求头中设置isLoading = false, 则可以取消全局请求loading效果
// 请求前拦截
axios.interceptors.request.use((config) => {
  // 开启全局loading
  if (config.headers.isLoading !== false) {
    showLoading()
  }
  return config
}, (err) => {
  // 取消全局请求loading
  if (err.config.headers.isLoading !== false) {
    hideLoading()
  }
  return Promise.reject(err)
})

// 返回后拦截
axios.interceptors.response.use((res) => {
  // 取消全局loading
  if (res.config.headers.isLoading !== false) {
    hideLoading()
  }
  return res
}, (err) => {
  // 取消全局loading
  if (err.config.headers.isLoading !== false) {
    hideLoading()
  }
  
  // 可以配置访问异常的回调提示
  if (err.message === 'Network Error') {
    message.warning('网络连接异常！')
  }
  
  return Promise.reject(err)
})


const $http = (url = '', data = {}, type = 'GET', _config = {}) => new Promise((resolve, reject) => {
  type = type.toUpperCase();
  const config = Object.assign(_config, {
    method: type,
    url: url
  });
  // get请求走正常
  if (['GET'].includes(type)) {
    config.params = data;
  } else { // post增加请求头，这里看数据格式，如果是json则需要自己更改
    Object.assign(config, {
      headers: {
         // 'Content-Type': 'application/json', // 这里自己协商，用formdata还是json
        'Content-Type': 'multipart/form-data',
        'token': localStorage.getItem('token')
      }
    });
    
    // 封装Data => FormData
    const formdata = new FormData();
    for (let key in data) {
      formdata.append(key, data[key]);
    }
    config.data = formdata;
  }
  
  axios(config).then((response) => {
    // 登录失败，封装以下，当接口报错后，返回报错接口，报错参数
    if (response && (response.data.code !== 200)) {
      console.error('接口传参报错', response.config.url, '参数', JSON.parse(convert_FormData_to_json2(response.config.data)))
      message.info(response.data.msg);
      resolve(response && response.data);
    } else {
      resolve(response && response.data);
    }
  })
    .catch((err) => {
      // 服务端报错，则返回报错接口
      console.error('接口服务报错', err.config.url)
      reject(err);
    });
})

let convert_FormData_to_json2 = (formData) => {
  let objData = {};
  formData.forEach((value, key) => objData[key] = value);
  return JSON.stringify(objData);
}

// 配置的是当code返回200，则直接返回数据，这个前端可以直接获取数据，可以少写一个if判断
export const $getData = async (url, data, _config = {}) => {
  let res = await $http(url, data, 'GET', _config)
  if (res.code === 200){
    return Promise.resolve(res.data)
  } else {
    return Promise.reject(res.data)
  }
  // 如果改成这种，请求会无条件返回，需要在调用接口的地方，再做判断
  // return Promise.resolve(res)
}

// 同上
export const $postData = async (url, data, _config = {}) => {
  let res = await $http(url, data, 'POST', _config)
  if (res.code === 200){
    return Promise.resolve(res)
  } else {
    return Promise.reject(res)
  }
  // 同上
  // return Promise.resolve(res)
}

```

## 2020-07-10 配置vw自适应布局
### 下包
```
npm i -S cssnano postcss-viewport-units postcss-aspect-ratio-mini postcss-px-to-viewport-opt postcss-write-svg postcss-preset-env
```
### 配置webpack.config文件
```
// 在文件头部导入下载的包
const postcssAspectRatioMini = require('postcss-aspect-ratio-mini');
const postcssPxToViewport = require('postcss-px-to-viewport-opt');
const postcssWriteSvg = require('postcss-write-svg');
const postcssPresetEnv = require('postcss-preset-env')
const postcssViewportUnits = require('postcss-viewport-units');
const cssnano = require('cssnano');
```
```
// 找到postcss部分，在下面加入配置项
{
    // Options for PostCSS as we reference these options twice
    // Adds vendor prefixing based on your specified browser support in
    // package.json
    loader: require.resolve('postcss-loader'),
    options: {
      // Necessary for external CSS imports to work
      // https://github.com/facebook/create-react-app/issues/2677
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
        }),
        // Adds PostCSS Normalize as the reset css with default options,
        // so that it honors browserslist config in package.json
        // which in turn let's users customize the target behavior as per their needs.
        postcssNormalize(),
        
        // 在这个位置加入VW需要的配置的
        postcssAspectRatioMini({}),
        postcssPxToViewport({
          viewportWidth: 1920, // (Number) The width of the viewport.
          viewportHeight: 1080, // (Number) The height of the viewport.
          unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
          viewportUnit: 'vw', // (String) Expected units.
          selectorBlackList: ['.ignore', '.hairlines', '.antd'], // (Array) The selectors to ignore and leave as px.
          minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
          mediaQuery: false, // (Boolean) Allow px to be converted in media queries.
          exclude: /(\/|\\)(node_modules)(\/|\\)/
        }),
        postcssWriteSvg({
          utf8: false
        }),
        postcssPresetEnv({}),
        postcssViewportUnits({}),
        cssnano({
          'cssnano-preset-advanced': {
            zindex: false,
            autoprefixer: false
          }
        }),
        // 在这个位置加入VW需要的配置
      ],
      sourceMap: isEnvProduction && shouldUseSourceMap,
    },
},
```

## 2020-05-17配置了mobx，stylus，router-dom，antd
### 增加component组件内的普通页面模板normal_page
### 增加component组件内的mobx页面模板store_page
## mobx配置
### 下包
```
npm i -S mobx mobx-react
```
### 在src下新建store文件夹，并创建index.js
```
import { configure } from 'mobx';

import HomePage from '../views/home_page/store'
import NavBar from '../component/nav_bar/store'
import MenuBar from '../component/menu_bar/store'
import InfoPage from '../views/info_page/store'
import LoginPage from '../views/login_page/store'
import NotPage from '../views/404_page/store'

configure({ enforceActions: 'always' });

class AppStore {
  constructor () {
    this.homePageStore = new HomePage(this);
    this.navBarStore = new NavBar(this);
    this.menuBarStore = new MenuBar(this);
    this.infoStore = new InfoPage(this);
    this.loginStore = new LoginPage(this);
    this.notStore = new NotPage(this)
  }
}

export default new AppStore()

```
### 在每个页面下建立store.js

## 配置stylus
### 下包
```
npm i -D stylus stylus-loader
```
### 在webpack.config.js配置
找到rules数组下的oneOf，看到这里都是配置是css，js等文件的loader，在下面增加
```
 { // 配置 stylus
              test: stylusRegex,
              exclude: stylusModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 2,
                  sourceMap: isEnvProduction && shouldUseSourceMap,
                  modules: true, // 设置模块化
                },
                'stylus-loader'
              ),
              sideEffects: true,
            },
```
## 配置react-router-dom
### 下包
```
npm i -D react-router-dom
```
### 配置
在AppRouter.js 配置

在文件页面配置，并使用witherRouter注解

## 配置antd
### 下包
```
npm i -S antd
```
### 配置


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
