import { action, observable, computed, runInAction } from 'mobx';
import { $postData } from '../../utils/Http';
// import { Toast } from 'antd'

export default class Store {
  constructor (props) {
    this.props = props
  }
  
  @observable a = 0;
  @observable userName = '';
  @observable passWord = '';
  
  @action
  handleChangeName(event) {
    this.userName = event.target.value
  }
  
  @action
  handleChangePass(event) {
    this.passWord = event.target.value
  }
  
  @action
  async login (router) {
    let api = '/Login/LoginCheck';
    let requestData = {
      userName: this.userName,
      password: this.passWord
    };
    let res = await $postData(api, requestData).catch((err) => {
      console.log('err', err)
    });
    
    if (res) {
      runInAction(() => {
        console.log('success', res)
        localStorage.setItem('token', 'true');
        router.history.push('/home')
      })
    }
  }
  
  // @computed get c () {
  // }
  
}
