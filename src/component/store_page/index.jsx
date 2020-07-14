import React, { Component } from 'react'
import Style from './style.styl'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { withRouter, Link, Route } from 'react-router-dom'

@inject('testStore')
@withRouter
@observer

export default class CommentStore extends Component {
  
  constructor (props) {
    super(props)
    this.store = props.testStore
  }
  
  componentDidMount() {
    console.log('store', this.store)
  }
  
  componentWillUnmount() {
  }
  
  render() {
    return (
      <div></div>
    )
  }
}

CommentStore.propTypes = {
  testStore: PropTypes.object
};
