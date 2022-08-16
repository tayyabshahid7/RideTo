import classnames from 'classnames'
import React from 'react'

import { PopupButton } from '@typeform/embed-react'
import styles from './styles.scss'

function CallUsCard() {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Unsure where to start?</h3>
      <p className={styles.content}>
        Find out what licence and course is right for you.
      </p>
      <PopupButton id="Oz2Xj6wN" className={classnames(styles.button)}>
        Take quiz now
      </PopupButton>
    </div>
  )
}

export default CallUsCard
