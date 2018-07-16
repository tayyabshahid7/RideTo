import React, { Component } from 'react';
// import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from 'scenes/Login'
import MainLayout from 'scenes/MainLayout'
import ProtectedRoute from 'shared/ProtectedRoute'
import styles from './styles.scss'

class App extends Component{
  render(){
    return(
      <div className={styles.App}>
        <Router>
          <div>
            <Switch>
              <Route exact path="/login" component={Login} />
              <ProtectedRoute path="/" component={MainLayout} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App
