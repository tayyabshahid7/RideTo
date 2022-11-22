import React, { Fragment, useEffect, useState } from 'react'

import RideToButton from 'components/RideTo/Button'
import MapComponent from 'components/RideTo/MapComponent'
import moment from 'moment'
import { getTrainingStatus } from 'services/course'
import styles from './styles.scss'

function UpComingCourse({ course, title, handleClick }) {
  const [isMapVisible, setIsMapVisible] = useState(false)
  const training = course.trainings[0]
  const { course_type, status } = training
  const isFullLicence = course_type === 'Full Licence Training'
  const { address_1, postcode, latitude, longitude } = course.training_location

  const showMap = () => {
    setIsMapVisible(prevState => !prevState)
  }

  useEffect(() => {
    if (
      window.location.hash &&
      window.location.hash === '#orders-section' &&
      handleClick
    ) {
      handleClick(course)
    }
  }, [])

  return (
    <div className={styles.container}>
      <h3 className={styles.subtitle}>
        {title && handleClick ? (
          <button
            onClick={() => {
              handleClick(course)
            }}
            className={styles.mapButton}>
            {title}
          </button>
        ) : (
          'Your course'
        )}
      </h3>
      <div>
        <h4>Course</h4>
        <p>{course_type}</p>
      </div>
      <div>
        <h4>Location</h4>
        <p>
          {handleClick ? (
            `${address_1}, ${postcode}`
          ) : (
            <Fragment>
              <button className={styles.mapButton} onClick={showMap}>
                {address_1}, {postcode}
              </button>
            </Fragment>
          )}
        </p>
        {isMapVisible && (
          <div className={styles.mapWrap}>
            <MapComponent
              userLocation={{
                lat: parseFloat(latitude),
                lng: parseFloat(longitude)
              }}
              width={'auto'}
              height={200}
              checkout
            />
          </div>
        )}
      </div>
      {!isFullLicence && (
        <div>
          <h4>Date & time</h4>
          {status === 'TRAINING_CONFIRMED' || status === 'TRAINING_CREATED'
            ? moment(
                training.training_date_time ||
                  training.date ||
                  training.requested_date
              ).format('h:mm a, ddd Do MMMM YYYY')
            : getTrainingStatus(status)}
        </div>
      )}
      <div className={styles.viewOrderDetails}>
        {handleClick && (
          <RideToButton
            alt
            onClick={() => handleClick(course)}
            id="order-side-panel"
            className={styles.viewOrderbutton}>
            View / Manage
          </RideToButton>
        )}
      </div>
    </div>
  )
}

export default UpComingCourse
