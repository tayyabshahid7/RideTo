import React, { useEffect, useState } from 'react'
import { getStaticData } from 'services/page'
import styles from './CourseAlternativeDatesSelectionConfirmation.scss'
import Loading from 'components/Loading'

const rideToMinimalGreenImg =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/rideToMinimalGreen.jpg'
const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLogoWrapper}>
        <img
          className={styles.headerLogo}
          src={rideToMinimalGreenImg}
          alt="rideto logo green"
        />
      </div>
      <h4 className={styles.headerTitle}>Thank You!</h4>
    </div>
  )
}

const OrderConfirmationThankYouPage = () => {
  const [orderId, setOrderId] = useState(null)

  const ConfirmationText = ({ userName }) => {
    return (
      <div className={styles.headerTextWrapper}>
        <p>Your booking is being processed and you will be redirected soon.</p>
        <p>
          If you are not redirected within 5 seconds please click{' '}
          <a href={`/account/dashboard/${orderId}`}>here</a>.
        </p>
      </div>
    )
  }

  useEffect(() => {
    const context = getStaticData('RIDETO_PAGE')
    setOrderId(context['orderId'])

    setTimeout(() => {
      window.location = `/account/dashboard/${context['orderId']}`
    }, 2000)
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Header />

        <div className={styles.body}>
          <div className={styles.confirmationTextWrapper}>
            <ConfirmationText />
            <Loading loading={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationThankYouPage
