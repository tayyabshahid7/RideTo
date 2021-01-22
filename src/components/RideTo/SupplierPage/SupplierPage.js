import React from 'react'
import SupplierInfo from './SupplierInfo'
import SupplierExtraInfo from './SupplierExtraInfo'
import styles from './styles.scss'

const SupplierPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <SupplierInfo />
      </div>
      <div className={styles.rightContent}>
        <SupplierExtraInfo />
      </div>
    </div>
  )
}

export default SupplierPage
