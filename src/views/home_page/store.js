import { action, observable, computed, runInAction } from 'mobx';
// import { Toast } from 'antd'
import {$postData} from '../../utils/Http';

export default class Store {
  constructor () {
  }
  
  @observable a = 0
  
  async getData () {
    let api = '/addUser';
    let requestData = {
      userName: 123,
      password: '123',
      userEmail: 123,
      userMobile: 123,
      accountStatus: 123,
      userSex: 123,
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
