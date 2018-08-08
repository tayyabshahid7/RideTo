import React from 'react'
import { Route } from 'react-router-dom'

import styles from './MobileContainer.scss'
import MobileDetails from 'pages/Widget/components/MobileDetails'

class MobileContainer extends React.Component {
  render() {
    const { match, profile, profiles } = this.props
    const url = `${match.url}mobile`

    return (
      <div className={styles.mobileContainer}>
        <h1 className={styles.heading}>
          <img className={styles.logo} src={profile.logo} />
        </h1>

        <Route
          exact
          path="/widget/:slug"
          render={routeProps => <MobileDetails profile={profile} url={url} />}
        />

        <Route
          exact
          path="/widget/:slug/mobile"
          render={routeProps => <h2>BOOKING!!</h2>}
        />
      </div>
    )
  }
}

export default MobileContainer
