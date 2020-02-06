/* TODO:

Discuss endpoint to be hit on load:
-userName

Figure out where links should point to:
- terms and conditions
-helpful guide

Discuss endpoints to be hit on submit:
- alternative dates
-alternative locations

Adjust style:
    -fonts
    -spacing
*/

import React, { useState, useEffect } from 'react'
import styles from './CourseAlternativeDatesSelectionConfirmation.scss'
import rideToMinimalGreenImg from 'assets/images/rideToMinimalGreen.jpg'

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
      //fetch data here

      setUserName('Test User Name')
      setLoading(false)
    }
    fetchData()
  }, [])

  const ConfirmationText = ({ userName }) => {
    return (
      <div className={styles.headerTextWrapper}>
        <p>{`Hey ${userName}, thanks we've received your respose and we're working on getting your course booked in for you.`}</p>
        <p>
          Please keep an eye on your emails and SMS for further information and
          booking confirmation.
        </p>
        <p>
          Any booking made through RideTo.com is subject to our 3 working day
          cancellation policy. Full license courses are subject to our 11
          working dayt canellation policy. All bookings are subject to our{' '}
          <a>full terms and conditions</a>. This includes any changes to
          bookings made in writing, email, online or by telephone.
        </p>
        <p>
          Feel free to take alook at our <a> helpful guides</a> for information
          on what to wear and bring to your motorcycle training.
        </p>
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
