import React from 'react'
import styles from './styles.scss'

function CallUsCard() {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Want to chat?</h3>
      <p className={styles.content}>
        Call a member of our expect team to discuss your riding requirements.
      </p>
      <a href="tel:+442036039652" className={styles.button}>
        <span className={styles.mobileCall}>Call Us</span>
        <span className={styles.desktopCall}>0203 603 9652</span>
      </a>
    </div>
  )
}

export default CallUsCard
