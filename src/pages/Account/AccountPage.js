import { STRIPE_KEY } from 'common/constants'
import AccountSubNavbar from 'components/Account/AccountSubNavbar'
import React, { Component } from 'react'
import { Route } from 'react-router'
import { Elements, StripeProvider } from 'react-stripe-elements'
import AccountPassword from './AccountPassword'
import AvailabilityCourses from './AvailabilityCourses'
import Bikes from './Bikes'
import BookingWidgetSettings from './BookingWidgetSettings'
import CsvUpload from './CsvUpload'
import EmailSettings from './EmailSettings'
import Instructors from './Instructors'
import SMSSettings from './SMSSettings'
import styles from './styles.scss'

class AccountPage extends Component {
  render() {
    const { history, schoolId, isAdmin } = this.props

    if (!isAdmin) {
      return <div>No access</div>
    }

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
            path="/account/sms"
            render={routeProps => (
              <StripeProvider apiKey={STRIPE_KEY}>
                <Elements>
                  <SMSSettings {...routeProps} schoolId={schoolId} />
                </Elements>
              </StripeProvider>
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
            render={routeProps => <Bikes {...routeProps} />}
          />
        </div>
      </div>
    )
  }
}

export default AccountPage
