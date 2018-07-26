import React, { Component } from 'react'
// import { hot } from 'react-hot-loader';
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Switch, Route, Redirect } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import Login from './pages/Login'
import MainLayout from './pages/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import history from './history1'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './App.scss'

class App extends Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <div className={styles.App}>
          <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute path="/" component={MainLayout} />
          </Switch>
        </div>
      </ConnectedRouter>
    )
  }
}

export default App
