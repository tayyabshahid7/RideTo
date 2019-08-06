import React from 'react'
import styles from './styles.scss'
import Welcome from './Welcome'
import RouteToFreedom from './RouteToFreedom'
import NextStep from './NextStep'
import Achievements from './Achievements'

function DashboardPageV2() {
  return (
    <div className={styles.page}>
      <Welcome />
      <div className={styles.pageItem}>
        <RouteToFreedom />
      </div>
      <div className={styles.pageItem}>
        <NextStep />
      </div>
      <div className={styles.pageItem}>
        <Achievements />
      </div>
    </div>
  )
}

export default DashboardPageV2
