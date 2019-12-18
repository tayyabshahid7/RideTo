import React, { useEffect } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { loadTypeformScript } from 'utils/helper'

function CallUsCard() {
  useEffect(() => {
    loadTypeformScript()
  }, [])

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Unsure where to start?</h3>
      <p className={styles.content}>
        Find out what licence and course is right for you.
      </p>
      <a
        id="results-page-take-quiz-now-button"
        href="https://rideto.typeform.com/to/XeXuVE"
        className={classnames(styles.button, 'typeform-share')}>
        Take quiz now
      </a>
    </div>
  )
}

export default CallUsCard
