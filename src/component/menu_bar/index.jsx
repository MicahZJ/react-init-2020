import React, { Component } from 'react'
import Style from './style.styl'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { withRouter, Link, Route } from 'react-router-dom'

import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { observable } from 'mobx';

const { SubMenu } = Menu;

@inject('menuBarStore')
@withRouter
@observer

export default class CommentNav extends Component {
  
  constructor (props) {
    super(props)
    this.store = props.menuBarStore
  }
  rootSubmenuKeys = ['admin', 'edit', 'sub4'];
  
  state = {
    openKeys: [],
  };
  
  componentDidMount() {
    this.store.defaultSelected()
  }
  
  componentWillUnmount() {
  }
  
  defaultSelected = () => {
    const {pathname} = this.props.location
    let key = pathname.split('/')[1]
    console.log('a', key)
    this.setState({
      openKeys: [key]
    });
  }
  
  onOpenChange = (openKeys) => {
    console.log('openKeys', openKeys)
    const latestOpenKey = openKeys.find((key) => this.state.openKeys.indexOf(key) === -1);
    console.log('1', latestOpenKey)
    console.log('2', this.rootSubmenuKeys.indexOf(latestOpenKey))
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };
  
  clickMenu = (item) => {
    console.log('item', item)
  }
  
  render() {
    const {pathname} = this.props.location
    const {Keys} = this.store
    console.log('path', pathname)
    return (
      <Menu
        mode="inline"
        selectedKeys={pathname}
        openKeys={Keys}
        onOpenChange={this.store.onOpenChange}
        onClick={this.clickMenu}
        style={{ width: 256, height: 'calc(100vh - 50px)' }}
      >
        <SubMenu
          key="admin"
          title={
            <span>
              <MailOutlined />
              <span>Navigation One</span>
            </span>
          }
        >
          <Menu.Item key="/admin/home">
            <Link to="/admin/home">主页</Link>
          </Menu.Item>
          <Menu.Item key="/admin/info">
            <Link to="/admin/info">信息页</Link>
          </Menu.Item>
          <Menu.Item key="3">Option 3</Menu.Item>
          <Menu.Item key="4">Option 4</Menu.Item>
        </SubMenu>
        <SubMenu key="edit" icon={<AppstoreOutlined />} title="Navigation Two">
          <Menu.Item key="/edit/test">
            <Link to={'/edit/test'}>编辑页</Link>
          </Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <Menu.Item key="11">Option 11</Menu.Item>
          <Menu.Item key="12">Option 12</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

CommentNav.propTypes = {
  menuBarStore: PropTypes.object,
  location: PropTypes.object
};
