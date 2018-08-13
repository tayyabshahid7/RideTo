import React from 'react'

import styles from './MobileDetails.scss'

const MobileDetails = ({ widget, onContinue }) => {
  return (
    <div className={styles.mobileDetails}>
      <div className={styles.intro}>{widget.intro}</div>
      <a className="WidgetBtn" onClick={onContinue}>
        Continue
      </a>
    </div>
  )
}

export default MobileDetails
