import React, { useState, memo } from 'react'
import styles from './styles.scss'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import ButtonArrowGreen from 'assets/images/rideto/ButtonArrowGreen.svg'
import ContactV2 from '../../ContactV2'
import EmailIcon from 'assets/images/rideto/Email.svg'
import ChatIcon from 'assets/images/rideto/Chat.svg'
import closeSvg from 'assets/images/rideto/CloseDark.svg'
import classnames from 'classnames'

function SomethingElse() {
  const [contactModal, setContactModal] = useState(false)

  const handleContact = () => {
    setContactModal(true)
  }

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
            <p>We’re available Monday to Friday between 9:00am - 6:00pm</p>

            <button type="submit" className={styles.submitButton}>
              <span className={styles.submitButtonText}>Start Chat</span>
              <span>
                <img src={ButtonArrowWhite} alt="Go" />
              </span>
            </button>
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

      {contactModal && (
        <div className={styles.contactModal}>
          <button
            onClick={() => setContactModal(false)}
            className={styles.closeButton}>
            <img src={closeSvg} alt="close" />
          </button>
          <ContactV2 />
        </div>
      )}
    </>
  )
}

export default memo(SomethingElse)
