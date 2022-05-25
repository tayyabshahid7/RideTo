import React, { useEffect, useState } from 'react'
import { getStaticData } from 'services/page'
import styles from './CourseAlternativeDatesSelectionConfirmation.scss'
const rideToMinimalGreenImg =
  'https://rideto-production.imgix.net/static/images/rideToMinimalGreen.jpg?q=80&auto=format,compress,true'

const shopImageMobile =
  'https://rideto-production.imgix.net/static/images/shop-now-banner-mobile.jpg?q=80&auto=format,compress,true'

const shopImage =
  'https://rideto-production.imgix.net/static/images/shop-now-banner.jpg?q=80&auto=format,compress,true'

const Header = ({ userName }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLogoWrapper}>
        <img
          className={styles.headerLogo}
          src={rideToMinimalGreenImg}
          alt="rideto logo green"
        />
      </div>
      <h4 className={styles.headerTitle}>Response Received</h4>
    </div>
  )
}

const CourseAlternativeDatesSelectionConfirmation = () => {
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState(undefined)

  useEffect(() => {
    const fetchData = async () => {
      const context = getStaticData('RIDETO_PAGE')
      setUserName(context.firstName)
      setLoading(false)
    }
    fetchData()
  }, [])

  const ConfirmationText = ({ userName }) => {
    return (
      <div className={styles.headerTextWrapper}>
        <p>{`Hey ${userName}, thanks we've received your response and we're working on getting your course booked in for you.`}</p>
        <p>
          Please keep an eye on your emails and SMS for further information and
          booking confirmation.
        </p>
        <p>
          Any booking made through RideTo.com is subject to our 5 working day
          cancellation policy. Full license courses are subject to our 11
          working days cancellation policy. All bookings are subject to our{' '}
          <a href="https://www.rideto.com/terms">full terms and conditions</a>.
          This includes any changes to bookings made in writing, email, online
          or by telephone.
        </p>
        <p>
          Feel free to take a look at our{' '}
          <a href="https://www.rideto.com/blog/category/guides">
            {' '}
            helpful guides
          </a>{' '}
          for information on what to wear and bring to your motorcycle training.
        </p>
        <a href="https://store.rideto.com/">
          <img
            className={styles.shopImageMobile}
            style={{ display: 'none' }}
            src={shopImageMobile}
            alt="Shop now"
          />
          <img className={styles.shopImage} src={shopImage} alt="Shop now" />
        </a>
      </div>
    )
  }

  if (loading) return <div>Loading ...</div>
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Header userName={userName} />

        <div className={styles.body}>
          <div className={styles.confirmationTextWrapper}>
            <ConfirmationText userName={userName} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseAlternativeDatesSelectionConfirmation
