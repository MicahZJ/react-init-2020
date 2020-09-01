import React, { Component } from 'react'
import Style from './style.styl'
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'

import QueueAnim from 'rc-queue-anim';

@inject('homePageStore')
@withRouter
@observer

export default class CommentHomePage extends Component {
  
  constructor (props) {
    super(props)
    this.store = props.homePageStore
  }
  
  componentDidMount() {
    this.store.getData()
  }
  
  componentWillUnmount() {
  }
  
  out = () => {
    localStorage.clear();
    location.reload()
    // this.props.history.push('login')
  };
  
  render() {
    return (
      <QueueAnim
        delay={150}
        type={['right', 'left']}
        ease={['easeOutQuart', 'easeInOutQuart']}>
        <div key="a" className={Style['home-wrapper']} onClick={() => {this.out()}}>666</div>
      </QueueAnim>
    )
  }
}

CommentHomePage.propTypes = {
  homePageStore: PropTypes.object,
  history: PropTypes.object
};
