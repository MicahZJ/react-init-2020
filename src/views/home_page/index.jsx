import React, { Component } from 'react'
import Style from './style.styl'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

@inject('homePageStore')
@withRouter
@observer

export default class CommentHomePage extends Component {
  
  constructor (props) {
    super(props)
    this.store = props.homePageStore
  }
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }
  
  out = () => {
    localStorage.clear()
    location.reload()
    // this.props.history.push('login')
  }
  
  render() {
    return (
      <div className={Style['home-wrapper']} onClick={() => {this.out()}}>666</div>
    )
  }
}

CommentHomePage.propTypes = {
  homePageStore: PropTypes.object,
  history: PropTypes.object
};
