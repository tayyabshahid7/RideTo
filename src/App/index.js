import React, { Component } from 'react';
// import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import LoginPage from 'scenes/LoginPage'
import MainLayout from 'scenes/MainLayout'
import ProtectedRoute from 'shared/ProtectedRoute'
import styles from './styles.scss'

// import Home from 'scenes/HomePage'

class App extends Component{
  render(){
    return(
      <div className={styles.App}>
        <Router>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <ProtectedRoute path="/" component={MainLayout} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App
// export default hot(module)(App);