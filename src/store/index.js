import { configure } from 'mobx';

import HomePage from '../views/home_page/store'
import NavBar from '../component/nav_bar/store'
import InfoPage from '../views/info_page/store'

configure({ enforceActions: 'always' })

class AppStore {
  constructor () {
    this.homePageStore = new HomePage(this)
    this.navBarStore = new NavBar(this)
    this.infoStore = new InfoPage(this)
  }
}

export default new AppStore()
