import React from 'react'
import { Link } from 'react-router-dom'

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
