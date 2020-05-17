import React, { Component } from 'react'
import asyncComponent from './units/asyncComponent'
import { Link, Route, BrowserRouter as Router} from 'react-router-dom'
import homePage from './views/home_page/index'
import NavBar from './component/nav_bar/index'
import InfoPage from './views/info_page/index'

// const todo = asyncComponent(() => import(/* webpackChunkName: "growCafe" */'./pages/to_do/index'));

export default class AppRoute extends Component {
  render () {
    return (<Router>
      <div>
        <NavBar name={'nav'}/>
        <Route exact path="/" component={homePage} />
        <Route exact path="/info" component={InfoPage} />
      </div>
    </Router>)
  }
}
