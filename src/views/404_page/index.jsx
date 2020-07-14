import React, { Component } from 'react'
import Style from './style.styl'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

@inject('notStore')
@withRouter
@observer

export default class Comment404Page extends Component {
  
  constructor (props) {
    super(props)
    this.store = props.notStore
  }
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }
  
  render() {
    return (
      <div className={Style['home-wrapper']}>错误页面</div>
    )
  }
}

Comment404Page.propTypes = {
  notStore: PropTypes.object
};
