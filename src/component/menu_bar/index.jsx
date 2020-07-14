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
  rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
  
  state = {
    openKeys: ['sub1'],
  };
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }
  
  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find((key) => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };
  
  render() {
    const {current} = this.store
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        style={{ width: 256, height: 'calc(100vh - 50px)' }}
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <MailOutlined />
              <span>Navigation One</span>
            </span>
          }
        >
          <Menu.Item key="1">
            <Link to="/home">主页</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/info">信息页</Link>
          </Menu.Item>
          <Menu.Item key="3">Option 3</Menu.Item>
          <Menu.Item key="4">Option 4</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
          <Menu.Item key="5">Option 5</Menu.Item>
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
  menuBarStore: PropTypes.object
};
