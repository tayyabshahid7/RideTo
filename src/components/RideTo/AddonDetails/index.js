import React from 'react'

import styles from './AddonDetails.scss'
import Button from 'components/RideTo/Button'
import AddWhite from 'assets/images/rideto/AddWhite.svg'

const AddonDetails = ({ addon, onAdd }) => {
  return (
    <div className={styles.addonDetails}>
      <h4>{addon.name}</h4>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: addon.description }}
      />
      <Button onClick={() => onAdd(addon)} className={styles.action}>
        <span>Add</span>
        <img src={AddWhite} alt="" />
      </Button>
    </div>
  )
}

export default AddonDetails
