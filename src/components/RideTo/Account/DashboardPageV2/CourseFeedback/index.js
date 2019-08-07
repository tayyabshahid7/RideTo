import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

function CourseFeedback() {
  return (
    <div>
      <h3 className={styles.subtitle}>
        Your CBT course was booked for today, how did it go?
      </h3>
      <div>
        <button className={styles.button}>I completed the course!</button>
        <button className={classnames(styles.button, styles.buttonActive)}>
          I didn't complete the course
        </button>
        <button className={styles.button}>
          I was unable to start the course
        </button>
      </div>
      <div className={styles.message}>
        <img
          className={styles.messageIcon}
          src="https://via.placeholder.com/58x58"
          alt="Icon"
          width="58"
          height="58"
        />
        <p>
          Congratulations! That's great news, onto the next step!{' '}
          <a href="/">Leave us a review on TrustPilot</a>
        </p>
      </div>
    </div>
  )
}

export default CourseFeedback
