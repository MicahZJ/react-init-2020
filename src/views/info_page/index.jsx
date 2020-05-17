import React, { Component } from 'react'
import Style from './style.styl'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

@inject('infoStore')
@withRouter
@observer

export default class CommentInfo extends Component {
  
  constructor (props) {
    super(props)
    this.store = props.infoStore
  }
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }
  
  render () {
    return (
      <div>123</div>
    )
  }
}

CommentInfo.propTypes = {
  infoStore: PropTypes.object
};
