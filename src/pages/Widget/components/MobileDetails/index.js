import React from 'react'

import styles from './MobileDetails.scss'

const MobileDetails = ({ widget, onContinue }) => {
  return (
    <div className={styles.mobileDetails}>
      <div className={styles.intro}>{widget.intro}</div>
      <button onClick={onContinue}>Continue</button>
    </div>
  )
}

export default MobileDetails
