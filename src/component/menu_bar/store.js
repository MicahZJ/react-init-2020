import { action, observable, computed } from 'mobx';
import { Toast } from 'antd'

export default class Store {
  constructor () {
  }
  
  @observable a = 0;
  @observable openKeys = ['sub1'];
  @observable rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
  
  // @computed get c () {
  // }
  
}
