import Loading from 'components/Loading'
import React, { useEffect, useState } from 'react'
import { getStaticData } from 'services/page'
import styles from './CourseAlternativeDatesSelectionConfirmation.scss'

const rideToMinimalGreenImg =
  'https://bike-tests.s3.eu-west-2.amazonaws.com/static/images/rideToMinimalGreen.jpg'
const Header = ({ status }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLogoWrapper}>
        <img
          className={styles.headerLogo}
          src={rideToMinimalGreenImg}
          alt="rideto logo green"
        />
      </div>
      {status !== 'failed' && (
        <h4 className={styles.headerTitle}>Thank You!</h4>
      )}
      {status === 'failed' && (
        <h4 className={styles.headerTitle}>Payment Failed.</h4>
      )}
    </div>
  )
}

const OrderConfirmationThankYouPage = () => {
  const [orderId, setOrderId] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const context = getStaticData('RIDETO_PAGE')
      const redirectStatus = new URLSearchParams(window.location.search).get(
        'redirect_status'
      )
      setStatus(redirectStatus)
      setOrderId(context['orderId'])
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (orderId && status !== 'failed') {
      setTimeout(() => {
        window.location = `/account/dashboard/${orderId}`
      }, 2000)
    }
  }, [status, orderId])

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

  const PaymentFailedText = ({ userName }) => {
    const supplier = new URLSearchParams(window.location.search).get('supplier')
    return (
      <div className={styles.headerTextWrapper}>
        <p>Please try again or try another payment method.</p>
        <p>
          If you are not redirected within 5 seconds please click{' '}
          <a href={`/${supplier}/checkout/`}>here.</a>.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Header status={status} />

        <div className={styles.body}>
          <div className={styles.confirmationTextWrapper}>
            {status !== 'failed' && (
              <>
                <ConfirmationText />
                <Loading loading={true} />
              </>
            )}
            {status === 'failed' && (
              <>
                <PaymentFailedText />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationThankYouPage
