import React, { memo } from 'react'

import ButtonArrowGreen from 'assets/images/rideto/ButtonArrowGreen.svg'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import ChatIcon from 'assets/images/rideto/Chat.svg'
import EmailIcon from 'assets/images/rideto/Email.svg'
import classnames from 'classnames'
import moment from 'moment'
import styles from './styles.scss'

function SomethingElse({ openContact }) {
  const handleContact = () => {
    openContact()
  }

  const currentTime = moment()
  const endTime = moment()
    .hour(17)
    .minutes(30)
  const isChatAvaiable = currentTime <= endTime && currentTime.hour() >= 9

  return (
    <>
      <div className={styles.questionContainer}>
        <h1 className={styles.subHeading}> Something Else </h1>
        <br />
        <div className={styles.container}>
          <div className={styles.somethingElseItem}>
            <span>
              <img src={ChatIcon} alt="icon" />
            </span>
            <h2>Live Chat</h2>
            <p>We’re available Monday to Friday between 9:00am - 5:30pm</p>

            {isChatAvaiable ? (
              <button
                onClick={() => {
                  window.location.href = '#hs-chat-open'
                }}
                type="submit"
                className={styles.submitButton}>
                <span className={styles.submitButtonText}>Start Chat</span>
                <span>
                  <img src={ButtonArrowWhite} alt="Go" />
                </span>
              </button>
            ) : (
              <button type="submit" className={styles.notAvaiableButton}>
                <span>not available</span>
              </button>
            )}
          </div>

          <div className={styles.somethingElseItem}>
            <span>
              <img src={EmailIcon} alt="icon" />
            </span>
            <h2>Email Us</h2>
            <p>
              Got a question? Drop us a message and one of the team will reply.
            </p>

            <button
              onClick={handleContact}
              type="submit"
              className={classnames(styles.submitButton, styles.hollow)}>
              <span
                className={classnames(
                  styles.submitButtonText,
                  styles.hollowText
                )}>
                Send us an email
              </span>
              <span>
                <img src={ButtonArrowGreen} alt="Go" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(SomethingElse)
