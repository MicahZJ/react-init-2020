import { action, observable, computed } from 'mobx';
import { Toast } from 'antd'

export default class Store {
  constructor () {
  }
  
  @observable a = 0
  @observable current = 'mail'
  
  @action changeNav (e) {
    this.current = e
    console.log('click ', this.current);
  }
  
  // @computed get c () {
  // }
  
}
