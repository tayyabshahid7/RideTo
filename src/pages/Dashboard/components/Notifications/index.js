import React, { Component } from 'react'
import styles from './styles.scss'
import SchoolSelect from 'components/SchoolSelect'

class Notifications extends Component {
  render() {
    const { schoolId, schoolName, schools, changeSchool } = this.props
    return (
      <div className={styles.container}>
        <h1>Notifications</h1>
        <SchoolSelect
          selected={schoolId}
          schools={schools}
          onChange={changeSchool}
        />
        <h2>Pending Orders</h2>
      </div>
    )
  }
}

export default Notifications
