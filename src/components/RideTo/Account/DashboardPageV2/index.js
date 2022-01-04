import { GOALS, STYLES } from './RouteToFreedom/constants'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { fetchOrder, fetchOrders } from 'services/user'
import {
  fetchUserDetails,
  recordGAEcommerceData,
  updateAchievement,
  updateTimelineStep,
  updateUserDetail
} from 'services/dashboard'
import {
  isAuthenticated as getIsAuthenticated,
  getToken,
  getUserProfile
} from 'services/auth'

import { ALL_ACHIEVEMENTS } from './Achievements/constants'
import Achievements from './Achievements'
import BookingCompleteBanner from 'components/RideTo/Account/BookingCompleteBanner'
import { DEFAULT_TIMELINE } from './constants'
import { Desktop } from 'common/breakpoints'
import GuidesAdvice from './GuidesAdvice'
import Loading from 'components/Loading'
import MyCheckList from './MyCheckList'
import MyOrders from './MyOrders'
import News from './News'
import NextStep from './NextStep'
import OrderDetails from 'components/RideTo/Account/OrderDetails'
import PasswordReset from './PasswordReset'
import RouteToFreedom from './RouteToFreedom'
import SidePanel from 'components/RideTo/SidePanel'
import classnames from 'classnames'
import { findLastStepIndex } from './RouteToFreedom/util'
import { matchStepsToGoal } from './util'
import styles from './styles.scss'
import { useMediaQuery } from 'react-responsive'

function DashboardPageV2({ match }) {
  const [userDetails, setUserDetails] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(GOALS[3])
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0])
  const [cbtStatus, setCbtStatus] = useState(null)
  const [dasStatus, setDasStatus] = useState(null)
  const [nextSteps, setNextSteps] = useState([])
  const [matchedNextSteps, setMatchedNextSteps] = useState([])
  const [recentOrder, setRecentOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [achievements, setAchivements] = useState([])
  const [nextStep, setNextStep] = useState(null)
  const [skipItm, setSkipItm] = useState(false)

  const isAuthenticated = getIsAuthenticated()
  const isConfirmationPage = !!match.params.orderId

  const [hasBanner, setHasBanner] = useState(isConfirmationPage)

  const [selectedOrder, setSelectedOrder] = useState(null)
  const headingImage = selectedOrder
    ? selectedOrder.training_location.image
    : ''

  const [isUserDetailsLoaded, setIsUserDetailsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSticky, setIsSticky] = useState(false)
  const isDesktop = useMediaQuery({ minWidth: 1025 })

  const copyrightRef = useRef(null)
  const [copyrightHeight, setCopyrightHeight] = useState(0)

  const handleOrderClick = course => {
    setSelectedOrder(course)
  }

  const handleCloseClick = () => {
    setSelectedOrder(null)
  }

  const handleGoalChange = event => {
    const { value } = event.target
    const goal = GOALS.find(goal => goal.constant === value)

    setSelectedGoal(goal)
    updateUserDetails('riding_goal', goal.constant)
  }

  const handleStyleChange = event => {
    const { value } = event.target
    const style = STYLES.find(style => style.constant === value)

    setSelectedStyle(style)
    updateUserDetails('riding_style', style.constant)
  }

  const updateUserDetails = (key, value) => {
    updateUserDetail(key, value, {
      course_completed_cbt: cbtStatus,
      course_completed_das: dasStatus,
      riding_goal: selectedGoal.constant,
      riding_style: selectedStyle.constant
    })
  }

  const updateAchievements = achievement => {
    if (!achievements.find(({ constant }) => constant === achievement)) {
      const newAchievement = ALL_ACHIEVEMENTS.find(
        ({ constant }) => constant === achievement
      )

      setAchivements(prevState => [
        ...prevState,
        {
          ...newAchievement,
          create_at: new Date().toISOString()
        }
      ])
      updateAchievement(newAchievement)
    }
  }

  const updateSteps = (constant, isCompleted = true, save = true) => {
    setNextSteps(prevState => {
      return prevState.map(step => {
        if (step.constant === constant && step.is_completed !== isCompleted) {
          return {
            ...step,
            is_completed: isCompleted
          }
        }

        return step
      })
    })

    nextSteps.forEach(step => {
      if (step.constant === constant && isCompleted) {
        if (save) {
          updateTimelineStep(step.name, step.constant, isCompleted)

          if (isCompleted) {
            step.achievements.forEach(achievement =>
              updateAchievements(achievement)
            )
          }
        }
      }
    })
  }
  const onOrderUpdateHandler = async username => {
    const { orderId } = match.params
    try {
      const result = await fetchOrders(username)
      if (result.results.length > 0) {
        setOrders(result.results)

        if (!orderId) {
          setRecentOrder(result.results[0])
          setSelectedOrder(result.results[0])
        }
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  const handleCompletedClick = (
    clickedConstant,
    isCompleted,
    delay = false
  ) => {
    let constant = clickedConstant

    if (constant.startsWith('STEP_CBT_')) {
      constant = 'STEP_CBT'
    }

    if (constant === 'STEP_CBT' && isCompleted) {
      updateUserDetail('course_completed_cbt', 'COMPLETED_COURSE', {})
    }

    if (constant.startsWith('STEP_FULL_LICENCE_')) {
      constant = 'STEP_FULL_LICENCE'
    }

    setTimeout(
      () => {
        updateSteps(constant, isCompleted)
      },
      delay ? 100 : 0
    )
  }

  const handlePreviewClick = clickedConstant => {
    const clickedStep = matchedNextSteps.find(
      step => step.constant === clickedConstant
    )

    setNextStep(clickedStep)
    if (!isDesktop) {
      const stepDom = document.getElementById('next-step-container')
      if (stepDom) {
        stepDom.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }
  }

  const updateSticky = status => {
    setIsSticky(status)
  }

  useEffect(() => {
    if (isDesktop) {
      if ('scrollRestoration' in window) {
        window.scrollRestoration = 'manual'
      }
      window.scrollTo(0, 0)
    }

    if (window.location.hash && window.location.hash === '#orders-section') {
      const orderSection = document.getElementById('orders-section')
      if (orderSection) {
        orderSection.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }
  }, [isLoading])

  useEffect(() => {
    const { orderId } = match.params

    const loadSingleOrder = async orderId => {
      const recentOrder = await fetchOrder(orderId)
      const course_title =
        recentOrder.course_title || recentOrder.trainings[0].course_type

      setRecentOrder(recentOrder)
      recordGAEcommerceData(recentOrder)

      // Set to show order if there is one
      if (orderId) {
        if (course_title === 'CBT Training') {
          // One step before the actual CBT step
          updateSteps('STEP_LICENCE', true, false)
          updateSteps('STEP_CBT', false, false)
          updateSteps('STEP_REVISE', false, false)
        } else if (course_title.startsWith('Full Licence')) {
          // One step before the actual full licence step
          updateSteps('STEP_FULL_LICENCE', false, false)
          updateSteps('STEP_THEORY_TEST', true, false)
        }
      }
    }

    const loadOrders = async username => {
      try {
        const result = await fetchOrders(username)

        if (result.results.length > 0) {
          setOrders(result.results)

          if (!orderId) {
            setRecentOrder(result.results[0])
          }
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
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
              return {
                ...defaultStep,
                ...userStep
              }
            } else {
              return defaultStep
            }
          })
        )
      }

      if (achievements.length) {
        setAchivements(achievements)
      }

      setIsUserDetailsLoaded(true)
    }

    setNextSteps(DEFAULT_TIMELINE)

    // If user is logged in load all orders
    if (isAuthenticated) {
      const user = getUserProfile(getToken())

      if (user) {
        setUserDetails(user)
        loadUserDetails(user.user_id)
        loadOrders(user.username)
      } else {
        setIsUserDetailsLoaded(true)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match, isAuthenticated])

  useEffect(() => {
    if (nextSteps.length) {
      const matchedSteps = matchStepsToGoal(selectedGoal, nextSteps)
      const selectedNextStep =
        matchedSteps[findLastStepIndex(matchedSteps, skipItm)]

      setMatchedNextSteps(matchedSteps)
      setNextStep(selectedNextStep)
    }
  }, [selectedGoal, nextSteps, skipItm])

  useEffect(() => {
    if (!recentOrder) {
      return
    }

    const course_title =
      recentOrder.course_title || recentOrder.trainings[0].course_type

    if (
      course_title === 'CBT Training' ||
      course_title.startsWith('Full Licence')
    ) {
      setSkipItm(true)
    }

    setIsLoading(false)
  }, [recentOrder])

  useEffect(() => {
    const { orderId } = match.params
    const staleConfirmations =
      JSON.parse(window.localStorage.getItem('staleConfirmations')) || []

    if (staleConfirmations.includes(orderId)) {
      setHasBanner(false)
    } else {
      window.localStorage.setItem(
        'staleConfirmations',
        JSON.stringify([orderId, ...staleConfirmations])
      )
    }
  }, [match])

  if (!matchedNextSteps.length || (!isAuthenticated && !isConfirmationPage)) {
    return null
  }

  const isStuck = isDesktop && !isLoading && isSticky

  return (
    <Fragment>
      <PasswordReset isAuthenticated={isAuthenticated} />
      <Loading loading={isLoading} position="top">
        <div className={styles.page}>
          {hasBanner && recentOrder && (
            <BookingCompleteBanner
              order={recentOrder}
              onDetails={handleOrderClick}
            />
          )}
          {!isLoading && (
            <div className={styles.pageItemFullWidthWrapper}>
              <div className={styles.pageItem}>
                <RouteToFreedom
                  nextSteps={matchedNextSteps}
                  selectedGoal={selectedGoal}
                  selectedStyle={selectedStyle}
                  handleGoalChange={handleGoalChange}
                  handleStyleChange={handleStyleChange}
                  handleCompletedClick={handleCompletedClick}
                  handlePreviewClick={handlePreviewClick}
                  updateAchievements={updateAchievements}
                  skipItm={skipItm}
                />
              </div>
            </div>
          )}
          {nextStep && !isLoading && (
            <div
              className={classnames(styles.pageItem, styles.pageItemNextStep)}>
              <NextStep
                nextStep={nextStep}
                handleCompletedClick={handleCompletedClick}
                recentOrder={recentOrder}
                cbtStatus={cbtStatus}
                dasStatus={dasStatus}
                selectedGoal={selectedGoal}
                updateUserDetails={updateUserDetails}
              />
            </div>
          )}
          <div className={styles.row}>
            <div className={styles.leftCol}>
              <div
                className={classnames(
                  styles.leftColInner,
                  isStuck && styles.leftColInnerStuck
                )}
                style={
                  isStuck
                    ? { maxHeight: `calc(100vh - ${copyrightHeight}px)` }
                    : undefined
                }>
                <div className={styles.leftColInnerStuckInner}>
                  {isAuthenticated && (
                    <Desktop>
                      <div className={styles.pageItem}>
                        <Achievements achievements={achievements} />
                      </div>
                    </Desktop>
                  )}
                  <div className={styles.pageItem}>
                    <MyOrders
                      orders={
                        orders.length > 0
                          ? orders
                          : recentOrder
                          ? [recentOrder]
                          : []
                      }
                      handleClick={handleOrderClick}
                    />
                  </div>
                  <div className={styles.pageItem}>
                    {isAuthenticated && (
                      <MyCheckList userId={userDetails.user_id} />
                    )}
                  </div>
                  <Desktop>
                    <div className={styles.pageItem}>
                      <GuidesAdvice />
                    </div>
                  </Desktop>
                </div>
              </div>
            </div>
            <div className={styles.rightCol}>
              <div
                className={classnames(
                  styles.pageItem,
                  styles.pageItemTransparent
                )}>
                <News
                  selectedGoal={selectedGoal}
                  selectedStyle={selectedStyle}
                  updateSticky={updateSticky}
                  isStuck={isStuck}
                  isUserDetailsLoaded={isUserDetailsLoaded}
                  copyrightRef={copyrightRef}
                  setCopyrightHeight={setCopyrightHeight}
                />
              </div>
            </div>
          </div>
          <div
            ref={copyrightRef}
            className={classnames(styles.pageItem, styles.pageItemFooter)}>
            <div className={styles.copyFooter}>
              © 2022 RideTo Ltd. Registered company number 10454345. Registered
              Office: 11 Orange Row, Brighton, BN1 1UQ
              <br />
              This information is given to you as a guide to support you in your
              choice of licence and RideTo has made every attempt to ensure the
              accuracy and reliability of the information provided about
              motorcycle licence and training requirements. However, RideTo
              cannot guarantee the information is up to date, correct and
              complete and is therefore provided on an "as is" basis only.
              RideTo accepts no liability whatsoever for any loss or damage
              howsoever arising. We recommend that you verify the current
              licence and training requirements by checking the DVSA website.
            </div>
          </div>
        </div>
      </Loading>
      <SidePanel
        visible={selectedOrder}
        headingImage={headingImage}
        onDismiss={handleCloseClick}>
        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onOrderUpdate={onOrderUpdateHandler}
          />
        )}
      </SidePanel>
    </Fragment>
  )
}

export default DashboardPageV2
