import React, { Component } from 'react'
import Style from './style.styl'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

import { Button, Input, Space } from 'antd';
import { UserOutlined, LockOutlined, DownloadOutlined, ArrowRightOutlined} from '@ant-design/icons';

@inject('loginStore')
@withRouter
@observer
export default class CommentLoginPage extends Component {
  
  constructor (props) {
    super(props);
    this.store = props.loginStore
  }
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }

  render() {
    return (
      <div id={Style['login-wrapper']}>
        <div className={Style['login-box']}>
          <div className={Style['login-container']}>
            <Input style={{marginBottom: 52, height: 50, borderRadius: 8}} value={this.store.userName} size="large" placeholder="请输入用户名" onChange={(e) => {this.store.handleChangeName(e)}}
              prefix={<UserOutlined />} />
            <Input.Password style={{height: 50, borderRadius: 8}} size="large" value={this.store.passWord} placeholder="请输入密码" onChange={(e) => {this.store.handleChangePass(e)}}
              prefix={<LockOutlined />} />
          </div>
        </div>
        <div className={Style['LoginBtn']}>
          <Space>
            <Button  type="default" icon={<UserOutlined />} size={'large'} />
            <Button  style={{width: 151}} type="default" icon={<ArrowRightOutlined />} onClick={() => this.store.login(this.props)} size={'large'} />
          </Space>
        </div>
        {/* <Button type="primary" onClick={() => this.store.login(this.props)}>登录</Button>*/}
      </div>
    )
  }
}

CommentLoginPage.propTypes = {
  loginStore: PropTypes.object,
  history: PropTypes.object
};
