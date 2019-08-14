import React, { useState, useEffect, Fragment } from 'react'
import styles from './styles.scss'
import RouteToFreedom from './RouteToFreedom'
import NextStep from './NextStep'
import Achievements from './Achievements'
import GuidesAdvice from './GuidesAdvice'
import News from './News'
import classnames from 'classnames'
import { GOALS, STYLES } from './RouteToFreedom/constants'
import { matchStepsToGoal } from './util'
import { fetchOrder, fetchOrders } from 'services/user'
import {
  getUserProfile,
  getToken,
  isAuthenticated as getIsAuthenticated
} from 'services/auth'
import { DEFAULT_TIMELINE } from './constants'
import {
  updateTimelineStep,
  fetchUserDetails,
  updateUserDetail,
  recordGAEcommerceData
} from 'services/dashboard'
import PasswordReset from './PasswordReset'

function DashboardPageV2({ match }) {
  const [selectedGoal, setSelectedGoal] = useState(GOALS[3])
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0])
  const [cbtStatus, setCbtStatus] = useState(null)
  const [dasStatus, setDasStatus] = useState(null)
  const [nextSteps, setNextSteps] = useState([])
  const [recentOrder, setRecentOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [achivements, setAchivements] = useState([])

  const isAuthenticated = getIsAuthenticated()

  const handleGoalChange = event => {
    const { value } = event.target
    const goal = GOALS.find(goal => goal.constant === value)

    setSelectedGoal(goal)
    updateUserDetail('riding_goal', goal.constant)
  }

  const handleStyleChange = event => {
    const { value } = event.target
    const style = STYLES.find(style => style.constant === value)

    setSelectedStyle(style)
    updateUserDetail('riding_style', style.constant)
  }

  const updateSteps = constant => {
    setNextSteps(prevState => {
      let found = false

      return prevState.map(step => {
        if (step.constant === constant) {
          found = true
          updateTimelineStep(step.name, step.constant, true)
          return {
            ...step,
            is_completed: true
          }
        }

        if (found) {
          updateTimelineStep(step.name, step.constant, false)
          return {
            ...step,
            is_completed: false
          }
        }

        updateTimelineStep(step.name, step.constant, true)
        return {
          ...step,
          is_completed: true
        }
      })
    })
  }

  const handleCompletedClick = (clickedConstant, delay = true) => {
    let constant = clickedConstant

    if (constant.startsWith('STEP_CBT_')) {
      constant = 'STEP_CBT'
    }

    if (constant.startsWith('STEP_FULL_LICENCE_')) {
      constant = 'STEP_FULL_LICENCE'
    }

    setTimeout(
      () => {
        updateSteps(constant)
      },
      delay ? 100 : 0
    )
  }

  useEffect(() => {
    const { orderId } = match.params

    const loadSingleOrder = async orderId => {
      const recentOrder = await fetchOrder(orderId)
      const { course_title } = recentOrder

      setRecentOrder(recentOrder)
      recordGAEcommerceData(recentOrder)

      if (!isAuthenticated) {
        if (course_title === 'CBT Training') {
          // One step before the actual CBT step
          updateSteps('STEP_REVISE')
        } else if (course_title.startsWith('Full Licence')) {
          // One step before the actual full licence step
          updateSteps('STEP_THEORY_TEST')
        }
      }
    }

    const loadOrders = async username => {
      const result = await fetchOrders(username)

      setOrders(result.results)

      if (!orderId) {
        setRecentOrder(result.results[0])
      }
    }

    const loadUserDetails = async userId => {
      const result = await fetchUserDetails(userId)
      const {
        riding_goal,
        riding_style,
        timeline,
        achievements,
        course_completed_cbt,
        course_completed_das
      } = result

      if (riding_goal) {
        setSelectedGoal(GOALS.find(goal => goal.constant === riding_goal))
      }

      if (riding_style) {
        setSelectedStyle(STYLES.find(style => style.constant === riding_style))
      }

      setCbtStatus(course_completed_cbt)
      setDasStatus(course_completed_das)

      if (timeline.length) {
        setNextSteps(
          DEFAULT_TIMELINE.map(defaultStep => {
            const userStep = timeline.find(
              userStep => userStep.constant === defaultStep.constant
            )

            if (userStep) {
              return userStep
            } else {
              return defaultStep
            }
          })
        )
      }

      if (achievements.length) {
        setAchivements(achievements)
      }
    }

    setNextSteps(DEFAULT_TIMELINE)

    // If user is logged in load all ordres
    if (isAuthenticated) {
      const user = getUserProfile(getToken())

      if (user) {
        loadUserDetails(user.user_id)
        loadOrders(user.username)
      }
    }

    // If there is an order id in url load it as recentOrder
    if (orderId) {
      loadSingleOrder(orderId)
      const next = `/account/dashboard/${orderId}`
      window.sessionStorage.setItem('login-next', JSON.stringify(next))
    }

    // If logged out with no order id in url then go to login page
    if (!isAuthenticated && !orderId) {
      window.location = '/account/login'
    }
  }, [match, isAuthenticated])

  if (!nextSteps.length || (!isAuthenticated && !match.params.orderId)) {
    return null
  }

  const matchedNextSteps = matchStepsToGoal(selectedGoal, nextSteps)
  let nextStep =
    matchedNextSteps.find(step => step.status === 'Not Started') ||
    matchedNextSteps.find(step => step.status === 'Ride')

  return (
    <Fragment>
      <PasswordReset isAuthenticated={isAuthenticated} />
      <div className={styles.page}>
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
        {nextStep && (
          <div className={classnames(styles.pageItem, styles.pageItemNextStep)}>
            <NextStep
              nextStep={nextStep}
              handleCompletedClick={handleCompletedClick}
              recentOrder={recentOrder}
              orders={orders}
              cbtStatus={cbtStatus}
              dasStatus={dasStatus}
            />
          </div>
        )}
        <div className={styles.row}>
          <div className={styles.leftCol}>
            {isAuthenticated && (
              <div className={styles.pageItem}>
                <Achievements achivements={achivements} />
              </div>
            )}
            <div className={styles.pageItem}>
              <GuidesAdvice />
            </div>
          </div>
          <div className={styles.rightCol}>
            <div
              className={classnames(
                styles.pageItem,
                styles.pageItemTransparent
              )}>
              <News selectedGoal={selectedGoal} selectedStyle={selectedStyle} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default DashboardPageV2
