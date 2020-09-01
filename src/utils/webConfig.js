let rootUrl;

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  // /正式环境api接口地址
  rootUrl = 'https://www.xxx.cn/api';
} else {
  // 开发环境配置
  rootUrl = 'http://192.168.1.112:3006/api';
}

const config = {
  version: '1.0.0',
  rootUrl: rootUrl,
};

export default config
