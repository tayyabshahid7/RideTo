import React, { useState } from 'react'
import styles from './styles.scss'
import Welcome from './Welcome'
import RouteToFreedom from './RouteToFreedom'
import NextStep from './NextStep'
import Achievements from './Achievements'
import GuidesAdvice from './GuidesAdvice'
import News from './News'
import classnames from 'classnames'
import { GOALS, STYLES } from './RouteToFreedom/constants'
import { matchStepsToGoal } from './util'

const LOADED_TIMELINE = [
  { constant: 'STEP_START', name: 'Start', is_completed: true },
  { constant: 'STEP_LICENCE', name: 'Licence', is_completed: true },
  { constant: 'STEP_ITM', name: 'ITM', is_completed: true },
  { constant: 'STEP_REVISE', name: 'Revise', is_completed: true },
  { constant: 'STEP_CBT', name: 'CBT', is_completed: false },
  { constant: 'STEP_THEORY_TEST', name: 'Theory Test', is_completed: false },
  { constant: 'STEP_FULL_LICENCE', name: 'Full Licence', is_completed: false },
  { constant: 'STEP_BIKE', name: 'Bike', is_completed: false },
  { constant: 'STEP_GEAR', name: 'Gear', is_completed: false },
  { constant: 'STEP_INSURE', name: 'Insure', is_completed: false },
  { constant: 'STEP_RIDE', name: 'Ride', is_completed: false }
]

function DashboardPageV2() {
  const [selectedGoal, setSelectedGoal] = useState(GOALS[3])
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0])
  const [nextSteps, setNextSteps] = useState(LOADED_TIMELINE)

  const handleGoalChange = event => {
    const { value } = event.target

    setSelectedGoal(GOALS.find(goal => goal.constant === value))
  }

  const handleStyleChange = event => {
    const { value } = event.target

    setSelectedStyle(STYLES.find(style => style.constant === value))
  }

  const updateSteps = constant => {
    setNextSteps(prevState => {
      let found = false

      return prevState.map(step => {
        if (step.constant === constant) {
          found = true
          return {
            ...step,
            is_completed: true
          }
        }

        if (found) {
          return {
            ...step,
            is_completed: false
          }
        }

        return {
          ...step,
          is_completed: true
        }
      })
    })
  }

  const handleCompletedClick = (constant, delay = true) => {
    setTimeout(
      () => {
        updateSteps(constant)
      },
      delay ? 100 : 0
    )
  }

  const matchedNextSteps = matchStepsToGoal(selectedGoal, nextSteps)

  return (
    <div className={styles.page}>
      <Welcome />
      <div className={styles.pageItemFullWidthWrapper}>
        <div className={styles.pageItem}>
          <RouteToFreedom
            nextSteps={matchedNextSteps}
            selectedGoal={selectedGoal}
            selectedStyle={selectedStyle}
            handleGoalChange={handleGoalChange}
            handleStyleChange={handleStyleChange}
            handleCompletedClick={handleCompletedClick}
          />
        </div>
      </div>
      {null && (
        <div className={classnames(styles.pageItem, styles.pageItemNextStep)}>
          <NextStep
            nextStep={null}
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
