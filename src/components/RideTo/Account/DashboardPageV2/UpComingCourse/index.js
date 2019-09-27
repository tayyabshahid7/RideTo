import React, { useState, Fragment } from 'react'
import MapComponent from 'components/RideTo/MapComponent'
import styles from './styles.scss'
import moment from 'moment'
import { getTrainingStatus } from 'services/course'
import classnames from 'classnames'

function UpComingCourse({ course, title, handleClick }) {
  const [isMapVisible, setIsMapVisible] = useState(false)
  const training = course.trainings[0]
  const { course_type, status } = training
  const isFullLicence = course_type === 'Full Licence Training'
  const { address_1, postcode, latitude, longitude } = course.training_location

  const showMap = () => {
    setIsMapVisible(prevState => !prevState)
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.subtitle}>
        {title && handleClick ? (
          <button
            onClick={() => {
              handleClick(course)
            }}
            className={styles.orderButton}>
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
          {status === 'TRAINING_CONFIRMED'
            ? moment(
                training.training_date_time ||
                  training.date ||
                  training.requested_date
              ).format('ddd Do MMMM YYYY')
            : getTrainingStatus(status)}
        </div>
      )}
      {handleClick && (
        <button
          onClick={() => {
            handleClick(course)
          }}
          className={classnames(styles.orderButton, styles.viewDetails)}>
          View details
        </button>
      )}
    </div>
  )
}

export default UpComingCourse
