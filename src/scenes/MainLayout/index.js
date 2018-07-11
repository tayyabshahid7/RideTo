import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NavigationBar from 'shared/NavigationBar'
import Dashboard from 'scenes/Dashboard/container'
import Orders from 'scenes/Orders'
import styles from './styles.scss'

const MainLayout = () => {
  return (
    <div className={styles.container}>
      <NavigationBar/>
      <Switch>
        <Route exact path="/dashboard" render={Dashboard}/>
        <Route exact path="/orders" render={Orders}/>
      </Switch>
    </div>
  )
}

export default MainLayout
