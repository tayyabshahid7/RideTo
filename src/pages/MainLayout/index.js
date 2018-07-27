import React from 'react'
import { Switch, Route } from 'react-router'
import NavigationBar from '../../components/NavigationBar'
import Dashboard from '../Dashboard/container'
import Orders from '../Orders/container'
import Calendar from '../Calendar'
import Footer from '../../components/Footer'
import styles from './styles.scss'
import classnames from 'classnames'

const MainLayout = ({ history }) => {
  return (
    <div className={styles.container}>
      <NavigationBar history={history} />
      <div className={styles.bodyContainer}>
        <Switch>
          <Route path="/orders" component={Orders} />
          <Route path="/calendar" component={Calendar} />
          <Route exact path="/" component={Dashboard} />
        </Switch>
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
