import { configure } from 'mobx';

import NavBar from '../component/nav_bar/store'
import MenuBar from '../component/menu_bar/store'

import HomePage from '../views/home_page/store'
import InfoPage from '../views/info_page/store'
import LoginPage from '../views/login_page/store'
import NotPage from '../views/404_page/store'

configure({ enforceActions: 'always' })

class AppStore {
  constructor () {
    this.navBarStore = new NavBar(this)
    this.menuBarStore = new MenuBar(this)
  
    this.homePageStore = new HomePage(this)
    this.infoStore = new InfoPage(this)
    this.loginStore = new LoginPage(this)
    this.notStore = new NotPage(this)
  }
}

export default new AppStore()
