import React, { Component } from 'react'
import Style from './style.styl'
import { withRouter, Link, Route } from 'react-router-dom'

@withRouter

export default class CommentNormal extends Component {
  
  constructor (props) {
    super(props)
  }
  
  a = '';  
  
  componentDidMount() {
  }
  
  componentWillUnmount() {
  }
  
  render() {
    return (
      <div>{this.a}</div>
    )
  }
}
