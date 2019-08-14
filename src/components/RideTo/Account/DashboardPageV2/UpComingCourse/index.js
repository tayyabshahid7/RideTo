import React from 'react'
import styles from './styles.scss'
import moment from 'moment'

// (40 Hours) for DAS
// <p>Within 3 days</p>

function UpComingCourse({ course, title, handleClick }) {
  const training = course.trainings[0]
  const { course_type } = training
  const isFullLicence = course_type === 'Full Licence Training'
  const { name, address_1, postcode } = course.training_location

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
          <a
            href={`https://www.google.com/maps?q=${name} ${postcode}`}
            target="_blank"
            rel="noopener noreferrer">
            {address_1}, {postcode}
          </a>
        </p>
      </div>
      {!isFullLicence && (
        <div>
          <h4>Date & time</h4>
          {moment(training.date || training.requested_date).format(
            'ddd Do MMMM YYYY'
          )}
        </div>
      )}
    </div>
  )
}

export default UpComingCourse
