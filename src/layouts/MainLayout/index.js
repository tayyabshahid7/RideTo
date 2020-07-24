import React, { useEffect } from 'react'
import { Switch, Route } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import NavigationBar from 'components/NavigationBar'
import Dashboard from 'pages/Dashboard/container'
import Orders from 'pages/Orders/container'
import CustomerListContainer from 'pages/Customers/ListContainer'
import CustomerDetailContainer from 'pages/Customers/DetailContainer'
import NotificationContainer from 'pages/Notifications/NotificationContainer'
import Calendar from 'pages/Calendar'
import Account from 'pages/Account'
import Terms from 'pages/Terms'
import Footer from 'components/Footer'
import styles from './styles.scss'
import classnames from 'classnames'
import Loading from 'components/Loading'
import { getAllInstructors } from 'store/instructor'

const MainLayout = ({
  history,
  location: { pathname },
  user,
  getAllInstructors,
  instructorsLoaded
}) => {
  useEffect(() => {
    if (user) {
      const schoolIds = user.suppliers.map(x => x.id)
      getAllInstructors(schoolIds)
    }
  }, [user])
  const isGreyBg = pathname.match(/\/customers\/\d+/)
  const isCalendar = pathname.match(/\/calendar/g)

  if (!instructorsLoaded) {
    return <Loading loading cover />
  }

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
          <Route path="/terms" component={Terms} />
          <Route exact path="/" component={Dashboard} />
        </Switch>
        {!isCalendar && <Footer />}
      </div>
      <NotificationContainer />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    instructorsLoaded: state.instructor.loadedAll,
    user: state.auth.user
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getAllInstructors
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainLayout)
