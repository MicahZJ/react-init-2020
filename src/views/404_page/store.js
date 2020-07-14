import { action, observable, computed, runInAction } from 'mobx';
import { $postData } from '../../utils/Http';
// import { Toast } from 'antd'

export default class Store {
  constructor () {
  }
  
  @observable a = 0
  
  @action
  async getData () {
    let api = '/Login/LoginCheck';
    let requestData = {
      userNmae: 123,
      password: 123
    };
    let res = await $postData(api, requestData).catch((err) => {
      console.log('err', err)
    });
    
    if (res) {
      runInAction(() => {
        console.log('success', res)
      })
    }
  }
  
  // @computed get c () {
  // }
  
}
