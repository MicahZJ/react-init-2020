import { action, observable, computed } from 'mobx';
import { Toast } from 'antd';

export default class Store {
  constructor () {
  }
  
  @observable a = 0
  
  @action b () {
  }
  
  // @computed get c () {
  // }
  
}
