import React, { useState } from 'react'
import styles from './styles.scss'
import Welcome from './Welcome'
import RouteToFreedom from './RouteToFreedom'
import NextStep from './NextStep'
import Achievements from './Achievements'
import GuidesAdvice from './GuidesAdvice'
import News from './News'
import classnames from 'classnames'
import NEXT_STEPS from './NextStep/content'

function DashboardPageV2() {
  // const [nextSteps, setNextSteps] = useState(NEXT_STEPS)
  const [nextSteps] = useState(NEXT_STEPS)

  return (
    <div className={styles.page}>
      <Welcome />
      <div className={styles.pageItemFullWidthWrapper}>
        <div className={styles.pageItem}>
          <RouteToFreedom nextSteps={nextSteps} />
        </div>
      </div>
      <div className={classnames(styles.pageItem, styles.pageItemNextStep)}>
        <NextStep
          nextStep={nextSteps.find(step => step.status === 'Next Step')}
        />
      </div>
      <div className={styles.row}>
        <div className={styles.leftCol}>
          <div className={styles.pageItem}>
            <Achievements />
          </div>
          <div className={styles.pageItem}>
            <GuidesAdvice />
          </div>
        </div>
        <div className={styles.rightCol}>
          <div
            className={classnames(styles.pageItem, styles.pageItemTransparent)}>
            <News />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPageV2
