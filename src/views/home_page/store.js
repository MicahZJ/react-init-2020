import { action, observable, computed, runInAction } from 'mobx';
// import { Toast } from 'antd'
import { $getData, $postData } from '../../utils/Http';

export default class Store {
  constructor () {
  }
  
  @observable a = 0
  
  async getData () {
    let api = '/queryUser';
    let requestData = {};
    let res = await $getData(api, requestData).catch((err) => {
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
