import React from 'react'
import { Link } from 'react-router-dom'

import styles from './MobileDetails.scss'

const MobileDetails = ({ url, widget }) => {
  return (
    <div className={styles.mobileDetails}>
      <div className={styles.intro}>{widget.intro}</div>

      <Link to={url}>Continue</Link>
    </div>
  )
}

export default MobileDetails
