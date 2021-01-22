import React from 'react'
import SupplierInfo from './SupplierInfo'
import styles from './styles.scss'

const SupplierPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <SupplierInfo />
      </div>
      <div className={styles.rightContent}></div>
    </div>
  )
}

export default SupplierPage
