import classnames from 'classnames'
import React from 'react'
import styles from './styles.scss'

function CallUsCard() {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Unsure where to start?</h3>
      <p className={styles.content}>
        Find out what licence and course is right for you.
      </p>
      <a
        target={'_blank'}
        id="results-page-take-quiz-now-button"
        href="https://rideto.typeform.com/to/Oz2Xj6wN"
        className={classnames(styles.button, 'typeform-share')}>
        Take quiz now
      </a>
    </div>
  )
}

export default CallUsCard
