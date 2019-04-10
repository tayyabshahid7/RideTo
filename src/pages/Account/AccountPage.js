import React, { Component } from 'react'
import { Route } from 'react-router'
import AccountSubNavbar from 'components/Account/AccountSubNavbar'
import AvailabilityCourses from './AvailabilityCourses'
import AccountPassword from './AccountPassword'
import BookingWidgetSettings from './BookingWidgetSettings'
import EmailSettings from './EmailSettings'
import Instructors from './Instructors'
import CsvUpload from './CsvUpload'
import Bikes from './Bikes'
import styles from './styles.scss'

class AccountPage extends Component {
  // componentDidMount() {
  //   this.loadData()
  // }

  render() {
    const { history, schoolId } = this.props
    return (
      <div className={styles.container}>
        <AccountSubNavbar history={history} />
        <div className={styles.content}>
          <Route
            exact
            path="/account"
            render={routeProps => <AvailabilityCourses {...routeProps} />}
          />
          <Route
            exact
            path="/account/availability"
            render={routeProps => <AvailabilityCourses {...routeProps} />}
          />
          <Route
            exact
            path="/account/account"
            render={routeProps => <AccountPassword {...routeProps} />}
          />
          <Route
            exact
            path="/account/widget-settings"
            render={routeProps => <BookingWidgetSettings {...routeProps} />}
          />
          <Route
            exact
            path="/account/emails"
            render={routeProps => (
              <EmailSettings {...routeProps} schoolId={schoolId} />
            )}
          />
          <Route
            exact
            path="/account/csv-upload"
            render={routeProps => (
              <CsvUpload {...routeProps} schoolId={schoolId} />
            )}
          />
          <Route
            exact
            path="/account/instructors"
            render={routeProps => (
              <Instructors {...routeProps} schoolId={schoolId} />
            )}
          />
          <Route
            exact
            path="/account/bikes"
            render={routeProps => <Bikes {...routeProps} schoolId={schoolId} />}
          />
        </div>
      </div>
    )
  }
}

export default AccountPage
