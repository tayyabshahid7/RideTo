import React from 'react'
import styles from './styles.scss'
import Welcome from './Welcome'
import RouteToFreedom from './RouteToFreedom'
import NextStep from './NextStep'
import Achievements from './Achievements'
import GuidesAdvice from './GuidesAdvice'
import News from './News'
// import CostCalc from './CostCalc'
import classnames from 'classnames'

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
      <div className={styles.pageItem}>
        <GuidesAdvice />
      </div>
      <div className={classnames(styles.pageItem, styles.pageItemTransparent)}>
        <News />
      </div>
    </div>
  )
}

export default DashboardPageV2
