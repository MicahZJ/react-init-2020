import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Provider } from 'mobx-react';
import AppRoute from './AppRouter'
import AppStore from './store/index'

function App () {
  return (
    <Provider {...AppStore}>
      <AppRoute />
    </Provider>
  );
}

export default App;
