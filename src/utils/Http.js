import axios from 'axios';
import React, { Component } from 'react';
import webConfig from './webConfig'
import ReactDOM from 'react-dom';
import crypto from './crypto';

import { message, Spin } from 'antd';

// 设置请求路径
axios.defaults.baseURL = webConfig.rootUrl;
axios.defaults.crossDomain = true

// 设置withCredentials的情况下，后端要设置Access-Control-Allow-Origin为你的源地址，
// 例如http://localhost:8080，不能是*，而且还要设置header(‘Access-Control-Allow-Credentials: true’);
// 不然会跨域
// axios.defaults.withCredentials = true;

// 设置post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 当前正在请求的数量
let requestCount = 0

// 显示loading
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

// 请求前拦截
axios.interceptors.request.use((config) => {
  // requestCount为0，才创建loading, 避免重复创建
  if (config.headers.isLoading !== false) {
    showLoading()
  }
  return config
}, (err) => {
  // 判断当前请求是否设置了不显示Loading
  if (err.config.headers.isLoading !== false) {
    hideLoading()
  }
  return Promise.reject(err)
})

// 返回后拦截
axios.interceptors.response.use((res) => {
  // 判断当前请求是否设置了不显示Loading
  if (res.config.headers.isLoading !== false) {
    hideLoading()
  }
  return res
}, (err) => {
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
  if (['GET'].includes(type)) { // 我这里是没用加密的，如果用，就把对应代码注释掉就行
    // 不加密传参
    config.params = data;
    // 加密传参
    // config.params = {}
    // config.params.data = crypto.encrypt(JSON.stringify(data));
    // config.params.timestamp = timestamp.toString()
  } else { // post增加请求头
    Object.assign(config, {
      headers: {
        // 'Content-Type': 'multipart/form-data', // formdata传参
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;application/json', // Json传参， 两种传参方式，自己定，我用的是json
      }
    });
    
    // 封装Data => FormData，json格式封装成formdata数据类型
    // const formdata = new FormData();
    // for (let key in data) {
    //  formdata.append(key, data[key]);
    // }
    // 不加密传参
    config.data = data;
    // 加密传参
    // config.data = {}
    // config.data.data = crypto.encrypt(JSON.stringify(data));
    // config.data.timestamp = timestamp.toString()
  }
  
  axios(config).then((response) => {
    // 失败
   if (response && (response.data.code !== 200)) {
      console.error('接口->请求未成功，传参报错', response.config.url, '参数', JSON.parse(response.config.data))
      message.info(response.data.msg);
      resolve(response && response.data);
    } else {
      resolve(response && response.data);
    }
  })
    .catch((err) => {
      console.error('接口', err.config.url, '服务端报错，报错码->', err.response.status.toString(), '参数->', JSON.parse(err.config.data));
      reject(err);
    });
})

// formData 转 Json
let convert_FormData_to_json2 = (formData) => {
  let objData = {};
  formData.forEach((value, key) => objData[key] = value);
  return JSON.stringify(objData);
}

export const $getData = async (url, data, _config = {}) => {
  let res = await $http(url, data, 'GET', _config)
  if (res.code === 200){
    return Promise.resolve(res.data)
  } else {
    return Promise.reject(res.data)
  }
  // return Promise.resolve(res)
}

export const $postData = async (url, data, _config = {}) => {
  let res = await $http(url, data, 'POST', _config)
  if (res.code === 200){
    return Promise.resolve(res)
  } else {
    return Promise.reject(res)
  }
  // return Promise.resolve(res)
}
