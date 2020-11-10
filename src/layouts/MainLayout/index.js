import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router'
import { useLocation } from 'react-router-dom'
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
import { getAllCourseTypes, fetchBankHolidays } from 'store/info'

const MainLayout = ({
  history,
  location: { pathname },
  user,
  getAllInstructors,
  getAllCourseTypes,
  fetchBankHolidays,
  instructorsLoaded
}) => {
  const [sidePanel, setSidePanel] = useState(false)
  useEffect(() => {
    if (user) {
      const schoolIds = user.suppliers.map(x => x.id)
      getAllInstructors(schoolIds)
      getAllCourseTypes(schoolIds)
      fetchBankHolidays()
    }
  }, [user])

  const location = useLocation()

  useEffect(() => {
    const sidePanel = location.pathname.match(/\/calendar\/.+/)
    setSidePanel(sidePanel)
  }, [location])

  const isGreyBg = pathname.match(/\/customers\/\d+/)
  const isCalendar = pathname.match(/\/calendar/g)

  if (!instructorsLoaded) {
    return <Loading loading cover />
  }

  return (
    <div
      className={classnames(styles.container, sidePanel && styles.sideActive)}>
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
      getAllInstructors,
      fetchBankHolidays,
      getAllCourseTypes
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainLayout)
