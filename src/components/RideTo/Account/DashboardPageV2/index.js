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
import { GOALS, STYLES } from './RouteToFreedom/content'

const matchStepsToGoal = (isFullLicenceGoal, nextSteps) => {
  return nextSteps.filter(step => {
    if (
      !isFullLicenceGoal &&
      ['NEXT_STEP_THEORY_TEST', 'NEXT_STEP_FULL_LICENCE'].includes(step.id)
    ) {
      return false
    }

    return true
  })
}

function DashboardPageV2() {
  const [selectedGoal, setSelectedGoal] = useState(GOALS[3])
  const [selectedStyle, setselectedStyle] = useState(STYLES[0])
  const isFullLicenceGoal = selectedGoal === 'Social Rider - Any Bike'
  const [nextSteps, setNextSteps] = useState(NEXT_STEPS)
  const filteredNextSteps = matchStepsToGoal(isFullLicenceGoal, nextSteps)
  const nextStep = filteredNextSteps.find(step => step.status === 'Next Step')

  const handleGoalChange = event => {
    const goal = event.target.value

    setSelectedGoal(goal)
  }

  const handleStyleChange = event => {
    setselectedStyle(event.target.value)
  }

  const updateSteps = (id, instant) => {
    setNextSteps(prevState => {
      let nextIndex = null

      if (instant) {
        let isCBTCompleted = false
        let found = false

        return prevState.map((step, i) => {
          if (['Start', 'Ride'].includes(step.status)) {
            return step
          }

          if (id === step.id) {
            found = true
            nextIndex = i + 1

            isCBTCompleted = id === 'NEXT_STEP_CBT'

            return {
              ...step,
              status: 'Completed'
            }
          }

          if (
            isCBTCompleted &&
            ['NEXT_STEP_CBT_BOOKED', 'NEXT_STEP_POST_CBT'].includes(step.id)
          ) {
            return {
              ...step,
              status: 'Completed'
            }
          }

          if (
            !isFullLicenceGoal &&
            isCBTCompleted &&
            ['NEXT_STEP_THEORY_TEST', 'NEXT_STEP_FULL_LICENCE'].includes(
              step.id
            )
          ) {
            return {
              ...step,
              status: 'Completed'
            }
          }

          if (
            isFullLicenceGoal &&
            isCBTCompleted &&
            step.id === 'NEXT_STEP_THEORY_TEST'
          ) {
            return {
              ...step,
              status: 'Next Step'
            }
          }

          if (
            !isFullLicenceGoal &&
            isCBTCompleted &&
            step.id === 'NEXT_STEP_GEAR'
          ) {
            return {
              ...step,
              status: 'Next Step'
            }
          }

          if (i === nextIndex) {
            return {
              ...step,
              status: 'Next Step'
            }
          }

          if (found) {
            return {
              ...step,
              status: 'Not Started'
            }
          }

          return {
            ...step,
            status: 'Completed'
          }
        })
      }

      return prevState
        .map((step, i) => {
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
        .map((step, i) => {
          if (!isFullLicenceGoal && id === 'NEXT_STEP_POST_CBT') {
            if (
              ['NEXT_STEP_THEORY_TEST', 'NEXT_STEP_FULL_LICENCE'].includes(
                step.id
              )
            ) {
              return {
                ...step,
                status: 'Completed'
              }
            }
            if (step.id === 'NEXT_STEP_GEAR') {
              return {
                ...step,
                status: 'Next Step'
              }
            }
          }

          return step
        })
    })
  }

  const handleCompletedClick = (id, delay = true) => {
    setTimeout(
      () => {
        updateSteps(id, !delay)
      },
      delay ? 100 : 0
    )
  }

  return (
    <div className={styles.page}>
      <Welcome />
      <div className={styles.pageItemFullWidthWrapper}>
        <div className={styles.pageItem}>
          <RouteToFreedom
            nextSteps={filteredNextSteps}
            selectedGoal={selectedGoal}
            selectedStyle={selectedStyle}
            handleGoalChange={handleGoalChange}
            handleStyleChange={handleStyleChange}
            handleCompletedClick={handleCompletedClick}
          />
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
