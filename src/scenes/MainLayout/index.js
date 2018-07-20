import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NavigationBar from 'shared/NavigationBar'
import Dashboard from 'scenes/Dashboard/container'
import Orders from 'scenes/Orders/container'
import Footer from 'shared/Footer'
import styles from './styles.scss'

const MainLayout = () => {
  return (
    <div className={styles.container}>
      <NavigationBar/>
      <div className={styles.bodyContainer}>
        <Switch>
          <Route path="/orders" render={Orders}/>
          <Route exact path="/" component={Dashboard}/>
        </Switch>
      </div>
      <Footer/>
    </div>
  )
}

export default MainLayout
