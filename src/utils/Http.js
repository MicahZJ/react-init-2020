import axios from 'axios';
import React, { Component } from 'react';
import webConfig from './webConfig'
import ReactDOM from 'react-dom';
import { message, Spin } from 'antd';

// 设置请求路径
axios.defaults.baseURL = webConfig.rootUrl;
axios.defaults.withCredentials = true;

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
  if (['GET'].includes(type)) {
    config.params = data;
  } else { // post增加请求头
    Object.assign(config, {
      headers: {
        'Content-Type': 'multipart/form-data'
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
    // 登录失败
    if (response && (response.data.code !== 200)) {
      console.error('接口传参报错', response.config.url, '参数', JSON.parse(convert_FormData_to_json2(response.config.data)))
      message.info(response.data.msg);
      resolve(response && response.data);
    } else {
      resolve(response && response.data);
    }
  })
    .catch((err) => {
      console.error('接口服务报错', err.config.url)
      reject(err);
    });
})

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
