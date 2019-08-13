import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import RouteToFreedom from './RouteToFreedom'
import NextStep from './NextStep'
import Achievements from './Achievements'
import GuidesAdvice from './GuidesAdvice'
import News from './News'
import classnames from 'classnames'
import { GOALS, STYLES } from './RouteToFreedom/constants'
import { matchStepsToGoal } from './util'
import { fetchOrder, fetchOrders, fetchUserDetails } from 'services/user'
import {
  getUserProfile,
  getToken,
  isAuthenticated as getIsAuthenticated
} from 'services/auth'
import { DEFAULT_TIMELINE } from './constants'

function DashboardPageV2({ match }) {
  const [selectedGoal, setSelectedGoal] = useState(GOALS[3])
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0])
  const [nextSteps, setNextSteps] = useState([])
  const [recentOrder, setRecentOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [achivements, setAchivements] = useState([])

  console.log(recentOrder, orders)

  const isAuthenticated = getIsAuthenticated()

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

  const recordGAEcommerceData = order => {
    if (order && window.localStorage.getItem('gaok') === 'true') {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        transactionId: order.friendly_id,
        transactionAffiliation: 'RideTo',
        transactionTotal: order.revenue,
        transactionProducts: [
          {
            sku: order.friendly_id,
            name: order.selected_licence,
            category: order.supplier_name,
            price: order.revenue,
            quantity: 1
          }
        ],
        event: 'rideto.ecom-purchase.completed'
      })
      window.localStorage.removeItem('gaok')
    }
  }

  useEffect(() => {
    const { params } = match
    const { orderId } = params

    const loadSingleOrder = async orderId => {
      const recentOrder = await fetchOrder(orderId)
      const { course_title } = recentOrder

      setRecentOrder(recentOrder)
      recordGAEcommerceData(recentOrder)

      if (course_title === 'CBT Training') {
        updateSteps('STEP_REVISE')
      } else if (course_title.startsWith('Full Licence')) {
        updateSteps('STEP_THEORY_TEST')
      }
    }

    const loadOrders = async username => {
      const result = await fetchOrders(username)

      setOrders(result.results)
    }

    const loadUserDetails = async userId => {
      const result = await fetchUserDetails(userId)
      const { riding_goal, riding_style, timeline, achievements } = result

      if (riding_goal) {
        setSelectedGoal(GOALS.find(goal => goal.constant === riding_goal))
      }

      if (riding_style) {
        setSelectedStyle(STYLES.find(style => style.constant === riding_style))
      }

      if (timeline.length) {
        setNextSteps(result.timeline)
      }

      if (achievements.length) {
        setAchivements(achievements)
      }
    }

    setNextSteps(DEFAULT_TIMELINE)

    if (isAuthenticated) {
      const user = getUserProfile(getToken())

      if (user) {
        loadUserDetails(user.user_id)
        loadOrders(user.username)
      }
    } else if (orderId) {
      loadSingleOrder(orderId)
      const next = `/account/dashboard/${orderId}`
      window.sessionStorage.setItem('login-next', JSON.stringify(next))
    } else {
      window.location = '/account/login'
    }
  }, [match, isAuthenticated])

  if (!nextSteps.length) {
    return null
  }

  const matchedNextSteps = matchStepsToGoal(selectedGoal, nextSteps)
  const nextStep = matchedNextSteps.find(step => step.status === 'Not Started')

  return (
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
            className={classnames(styles.pageItem, styles.pageItemTransparent)}>
            <News />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPageV2
