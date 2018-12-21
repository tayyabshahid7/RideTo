import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'

function Button({ type, age, size, onUpdate, selectedLicenceType }) {
  return (
    <button
      className={classnames(
        styles.licenceBtn,
        selectedLicenceType === type && styles.activeBtn
      )}
      onClick={() => onUpdate({ selectedLicenceType: type })}>
      <span className={styles.licenceBtnType}>{type}</span>
      <span className={styles.licenceBtnInfo}>
        <span>Age: {age}</span>
        <span>Bike size: {size}</span>
      </span>
    </button>
  )
}

export default Button
