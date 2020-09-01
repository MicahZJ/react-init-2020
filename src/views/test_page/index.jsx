import React, { Component } from 'react'
import Style from './style.styl'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

@withRouter
@observer

export default class CommentTest extends Component {
  
  constructor (props) {
    super(props)
  }
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }
  
  render () {
    return (
      <div style={{width: '100%', height: '100%'}}>555</div>
    )
  }
}
