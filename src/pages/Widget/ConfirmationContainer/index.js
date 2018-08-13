import React from 'react'

import styles from './ConfirmationContainer.scss'

class ConfirmationContainer extends React.Component {
  constructor(props) {
    super(props)
    this.widget = window.RIDE_TO_DATA.widget_initial
  }

  render() {
    return (
      <div className={styles.confirmationContainer}>
        <h2>Booked!</h2>
      </div>
    )
  }
}

export default ConfirmationContainer
