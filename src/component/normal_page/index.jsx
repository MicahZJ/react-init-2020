import React, { Component } from 'react'
import Style from './style.styl'
import { withRouter, Link, Route } from 'react-router-dom'

@withRouter

export default class CommentNormal extends Component {
  
  constructor (props) {
    super(props)
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
