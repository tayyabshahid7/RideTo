import React from 'react'
import { Switch, Route } from 'react-router'
import NavigationBar from 'components/NavigationBar'
import Dashboard from 'pages/Dashboard/container'
import Orders from 'pages/Orders/container'
import CustomerListContainer from 'pages/Customers/ListContainer'
import CustomerDetailContainer from 'pages/Customers/DetailContainer'
import Calendar from 'pages/Calendar'
import Footer from 'components/Footer'
import styles from './styles.scss'

const MainLayout = ({ history }) => {
  return (
    <div className={styles.container}>
      <NavigationBar history={history} />
      <div className={styles.bodyContainer}>
        <Switch>
          <Route path="/orders" component={Orders} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/customers" component={CustomerListContainer} exact />
          <Route
            path="/customers/:id"
            component={CustomerDetailContainer}
            exact
          />
          <Route exact path="/" component={Dashboard} />
        </Switch>
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
