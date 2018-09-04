import React, { Component } from 'react'
import { Route } from 'react-router'
import AccountSubNavbar from 'components/Account/AccountSubNavbar'
import AvailabilityCourses from './AvailabilityCourses'
import styles from './styles.scss'

class AccountPage extends Component {
  // componentDidMount() {
  //   this.loadData()
  // }

  render() {
    const { history } = this.props
    return (
      <div className={styles.container}>
        <AccountSubNavbar history={history} />
        <div>
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
        </div>
      </div>
    )
  }
}

export default AccountPage
