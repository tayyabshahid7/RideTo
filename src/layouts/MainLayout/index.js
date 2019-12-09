import React from 'react'
import { Switch, Route } from 'react-router'
import NavigationBar from 'components/NavigationBar'
import Dashboard from 'pages/Dashboard/container'
import Orders from 'pages/Orders/container'
import CustomerListContainer from 'pages/Customers/ListContainer'
import CustomerDetailContainer from 'pages/Customers/DetailContainer'
import NotificationContainer from 'pages/Notifications/NotificationContainer'
import Calendar from 'pages/Calendar'
import Account from 'pages/Account'
import Footer from 'components/Footer'
import styles from './styles.scss'
import classnames from 'classnames'

const MainLayout = ({ history, location: { pathname } }) => {
  const isGreyBg = pathname.match(/\/customers\/\d+/)
  const isCalendar = pathname.match(/\/calendar/g)

  return (
    <div className={styles.container}>
      <NavigationBar history={history} />
      <div
        className={classnames(
          styles.bodyContainer,
          isGreyBg && styles.bodyContainerGrey,
          isCalendar && styles.bodyContainerCalendar
        )}
        id="body-container">
        <Switch>
          <Route path="/orders" component={Orders} />
          <Route path="/calendar/:date?/:type?/:id?" component={Calendar} />
          <Route path="/customers" component={CustomerListContainer} exact />
          <Route
            path="/customers/:id"
            component={CustomerDetailContainer}
            exact
          />
          <Route path="/account" component={Account} />
          <Route exact path="/" component={Dashboard} />
        </Switch>
        {!isCalendar && <Footer />}
      </div>
      <NotificationContainer />
    </div>
  )
}

export default MainLayout
