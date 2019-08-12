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
  const [nextSteps, setNextSteps] = useState(NEXT_STEPS)
  const nextStep = nextSteps.find(step => step.status === 'Next Step')

  const updateSteps = id => {
    setNextSteps(prevState => {
      let nextIndex = null

      return prevState.map((step, i) => {
        if (id === step.id) {
          nextIndex = i + 1

          return {
            ...step,
            ...(!['Start', 'Ride'].includes(step.status) && {
              status: 'Completed'
            })
          }
        } else if (i === nextIndex) {
          return {
            ...step,
            ...(!['Start', 'Ride'].includes(step.status) && {
              status: 'Next Step'
            })
          }
        } else {
          return step
        }
      })
    })
  }

  const handleCompletedClick = id => {
    setTimeout(() => {
      updateSteps(id)
    }, 100)
  }

  return (
    <div className={styles.page}>
      <Welcome />
      <div className={styles.pageItemFullWidthWrapper}>
        <div className={styles.pageItem}>
          <RouteToFreedom nextSteps={nextSteps} />
        </div>
      </div>
      {nextStep && (
        <div className={classnames(styles.pageItem, styles.pageItemNextStep)}>
          <NextStep
            nextStep={nextStep}
            handleCompletedClick={handleCompletedClick}
          />
        </div>
      )}
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
