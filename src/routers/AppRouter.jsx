import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import { inject, observer } from 'mobx-react'

import { RouteWithSubRoutes } from './routers'

@inject('routersStore')
export default class AppRoute extends Component {
  constructor (props) {
    super(props)
    this.store = props.routersStore;
  }
  
  render () {
    let authPath = '/login';
  
    return (
      <Router>
        <Switch>
          {this.store.routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
          <Redirect to={{ pathname: authPath }} />
        </Switch>
      </Router>
    );
  }
}

AppRoute.propTypes = {
  routersStore: PropTypes.node
};
