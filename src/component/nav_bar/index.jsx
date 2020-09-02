import React, { Component } from 'react'
import Style from './style.styl'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { withRouter, Link, Route } from 'react-router-dom'

import { Layout, Menu, Button } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined, LogoutOutlined} from '@ant-design/icons';
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

@inject('navBarStore')
@withRouter
@observer

export default class CommentNav extends Component {
  
  constructor (props) {
    super(props)
    this.store = props.navBarStore
  }
  
  componentDidMount() {
    console.log('store', this.store)
  }
  
  componentWillUnmount() {
  }
  
  handleClick = (e) => {
    this.store.changeNav(e.key)
  };
  
  render() {
    const {current} = this.store;
    const out = () => {
      console.log(this.props);
      localStorage.clear();
      // location.reload();
      this.props.history.push('login')
    };
    return (
      <Header style={{ padding: '0 20px', boxSizing: 'border-box', background: 'white', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
        <Button onClick={out} type="primary" shape="round" icon={<LogoutOutlined />}>
          登出
        </Button>
      </Header>
      // <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
      //   <Menu.Item key="mail" icon={<MailOutlined />}>
      //     <Link to="/">主页</Link>
      //   </Menu.Item>
      //   <Menu.Item key="app" disabled icon={<AppstoreOutlined />}>
      //     Navigation Two
      //   </Menu.Item>
      //   <SubMenu icon={<SettingOutlined />} title="Navigation Three - Submenu">
      //     <Menu.ItemGroup title="Item 1">
      //       <Menu.Item key="setting:1">Option 1</Menu.Item>
      //       <Menu.Item key="setting:2">Option 2</Menu.Item>
      //     </Menu.ItemGroup>
      //     <Menu.ItemGroup title="Item 2">
      //       <Menu.Item key="setting:3">Option 3</Menu.Item>
      //       <Menu.Item key="setting:4">Option 4</Menu.Item>
      //     </Menu.ItemGroup>
      //   </SubMenu>
      //   <Menu.Item key="alipay">
      //     <Link to="/info">主页</Link>
      //   </Menu.Item>
      // </Menu>
    )
  }
}

CommentNav.propTypes = {
  navBarStore: PropTypes.object,
  history: PropTypes.object
};
