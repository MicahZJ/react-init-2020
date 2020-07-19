import { action, observable, computed } from 'mobx';
import { Toast } from 'antd'

export default class Store {
  constructor () {
  }
  
  @observable a = 0;
  @observable Keys = [];
  @observable rootSubmenuKeys = ['admin', 'edit', 'sub4'];
  
  @action
  defaultSelected = () => {
    const {pathname} = location
    let key = pathname.split('/')[1]
    console.log('a', [key])
    this.Keys = [key]
  }
  
  @action
  onOpenChange = (openKeys) => {
    console.log('openKeys', openKeys)
    const latestOpenKey = openKeys.find((key) => this.Keys.indexOf(key) === -1);
    console.log('1', latestOpenKey)
    console.log('2', this.rootSubmenuKeys.indexOf(latestOpenKey))
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.Keys = openKeys
    } else {
      this.Keys = latestOpenKey ? [latestOpenKey] : []
    }
  };
  // @computed get c () {
  // }
  
}
