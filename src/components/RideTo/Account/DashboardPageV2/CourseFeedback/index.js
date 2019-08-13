import React, { useState, Fragment } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { updateUserDetail } from 'services/dashboard'

const OPTIONS = [
  {
    id: 'COMPLETED_COURSE',
    text: 'I completed the course!',
    message:
      'Congratulations! That\'s great news, onto the next step! <a href="/">Leave us a review on TrustPilot</a>',
    icon: 'happy'
  },
  {
    id: 'NO_COMPLETED_COURSE',
    text: "I didn't complete the course",
    message:
      'Sorry to hear that, email us at <a href="mailto:hello@rideto.com">hello@rideto.com</a> to organise further training.',
    icon: 'sad'
  },
  {
    id: 'UNABLE_COMPLETED_COURSE',
    text: 'I was unable to start the course',
    message:
      'Sorry to hear that, email us at <a href="mailto:hello@rideto.com">hello@rideto.com</a> to rebook.',
    icon: 'sad'
  }
]

function CourseFeedback({ status, courseType }) {
  const [selected, setSelected] = useState(status)
  const selectedOption = OPTIONS.find(({ id }) => id === selected)

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.col}>
          <h3 className={styles.subtitle}>
            Your CBT course was booked for today, how did it go?
          </h3>
          {OPTIONS.map(({ id, text }) => (
            <button
              key={id}
              className={classnames(
                styles.button,
                selected === id && styles.buttonActive
              )}
              onClick={() => {
                setSelected(id)
                updateUserDetail(`course_completed_${courseType}`, id)
              }}>
              {text}
            </button>
          ))}
        </div>
        <div className={styles.col}>
          <div
            className={classnames(
              styles.message,
              selectedOption && styles.messageSelected
            )}>
            {selectedOption ? (
              <Fragment>
                <img
                  className={styles.messageIcon}
                  src="https://via.placeholder.com/58x58"
                  alt="Icon"
                  width="58"
                  height="58"
                />
                <p
                  dangerouslySetInnerHTML={{ __html: selectedOption.message }}
                />
              </Fragment>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseFeedback
