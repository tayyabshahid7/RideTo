import React from 'react'
import UserInfo from './UserInfo'
import PaymentForm from './PaymentForm'
import styles from './styles.scss'

const UserDetails = props => {
  return (
    <div className={styles.container}>
      <div className={styles.topPanel}>
        <UserInfo {...props} />
      </div>
      <div className={styles.bottomPanel}>
        <PaymentForm {...props} />
      </div>
    </div>
  )
}

export default UserDetails
