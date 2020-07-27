import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// 配置antd中文化
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment'; // 在原有的基础上加上下面三行代码
import 'moment/locale/zh-cn'
moment.locale('zh-cn');
// 配置antd中文化

ReactDOM.render(
  // <React.StrictMode>
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
