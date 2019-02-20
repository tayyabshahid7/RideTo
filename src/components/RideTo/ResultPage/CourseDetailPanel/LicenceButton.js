import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'

function Button({ type, age, size, onUpdate, selectedLicenceType, isWidget }) {
  return (
    <button
      className={classnames(
        styles.licenceBtn,
        selectedLicenceType === type && styles.activeBtn,
        isWidget && styles.widgetBtn
      )}
      onClick={() =>
        onUpdate({
          selectedLicenceType: type,
          selectedPackageDays: '',
          selectedPackageDates: []
        })
      }>
      <span className={styles.licenceBtnType}>{type}</span>
      <span className={styles.licenceBtnInfo}>
        <span>Age: {age}</span>
        <span>Bike size: {size}</span>
      </span>
    </button>
  )
}

export default Button