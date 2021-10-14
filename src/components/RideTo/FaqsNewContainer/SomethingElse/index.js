import React, { memo } from 'react'
import styles from './styles.scss'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'

function SomethingElse() {
  return (
    <div className={styles.questionContainer}>
      <h1 className={styles.subHeading}> Something Else </h1>
      <br />
      <div className={styles.container}>
        <div className={styles.somethingElseItem}>
          <span></span>
          <h2>Live Chat</h2>
          <p>We’re available Monday to Friday between 9:00am - 6:00pm</p>

          <button type="submit" className={styles.submitButton}>
            <span className={styles.submitButtonText}>Start Chat</span>
            <span>
              <img src={ButtonArrowWhite} alt="Go" />
            </span>
          </button>
        </div>

        <div className={styles.somethingElseItem}>
          <span></span>
          <h2>Email Us</h2>
          <p>
            Got a question? Drop us a message and one of the team will reply.
          </p>

          <button type="submit" className={styles.submitButton}>
            <span className={styles.submitButtonText}>Start Chat</span>
            <span>
              <img src={ButtonArrowWhite} alt="Go" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(SomethingElse)
