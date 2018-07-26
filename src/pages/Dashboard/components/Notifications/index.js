import React, { Component } from 'react'
import styles from './styles.scss'

class Notifications extends Component {
  render() {
    return (
      <div className={styles.container}>
        <h1>Notifications - {this.props.schoolName} </h1>
        <h2>Pending Orders</h2>
      </div>
    )
  }
}

export default Notifications
