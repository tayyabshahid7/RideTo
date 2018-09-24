import React from 'react'
import classnames from 'classnames'

import styles from './AddonDetails.scss'
import Button from 'components/RideTo/Button'
import AddWhite from 'assets/images/rideto/AddWhite.svg'
import Remove from 'assets/images/rideto/Remove.svg'

const AddonDetails = ({ addon, isAdded, onAdd, onRemove }) => {
  const removeClassName = classnames(styles.action, styles.remove)

  return (
    <div className={styles.addonDetails}>
      <h4>{addon.name}</h4>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: addon.description }}
      />

      {isAdded ? (
        <Button onClick={() => onRemove(addon)} className={removeClassName}>
          <span>Remove</span>
          <img src={Remove} alt="" />
        </Button>
      ) : (
        <Button onClick={() => onAdd(addon)} className={styles.action}>
          <span>Add</span>
          <img src={AddWhite} alt="" />
        </Button>
      )}
    </div>
  )
}

export default AddonDetails
