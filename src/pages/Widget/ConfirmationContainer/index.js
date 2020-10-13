import React from 'react'

import { parseQueryString } from 'services/api'
import styles from './ConfirmationContainer.scss'
import classnames from 'classnames'

class ConfirmationContainer extends React.Component {
  constructor(props) {
    super(props)

    const suppliers = window.RIDE_TO_DATA.widget_locations
    const query = parseQueryString(window.location.search.slice(1))
    this.supplier = suppliers.filter(
      ({ id }) => id === parseInt(query.supplier, 10)
    )[0]
  }

  handleReturnToWebsite = () => {
    window.history.go(2 - window.history.length)
  }

  render() {
    return (
      <div className={styles.confirmationContainer}>
        <h2>Booked!</h2>
        <div className={styles.thanks}>
          Thanks, your booking is now confirmed, please check your email for
          full details.
        </div>
        <div className={styles.supplier}>{this.supplier.name}</div>
        <button
          onClick={this.handleReturnToWebsite}
          className={classnames(styles.returnButton, 'WidgetBtn')}>
          Return to Website
        </button>
      </div>
    )
  }
}

export default ConfirmationContainer
