import React from 'react'

import styles from './AddonDetails.scss'

const AddonDetails = ({ addon }) => {
  return (
    <div className={styles.addonDetails}>
      <h4>{addon.name}</h4>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: addon.description }}
      />
    </div>
  )
}

export default AddonDetails
