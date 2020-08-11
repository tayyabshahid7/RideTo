import React from 'react'
import classnames from 'classnames'
import styles from './index.scss'
import { UserAvatar } from '../../../assets/icons'

const UserWithTooltip = ({ user, short = false }) => {
  let initial

  if (!short) {
    if (user.id === -1) {
      initial = 'Unassigned'
    } else {
      initial = user.first_name + ' ' + user.last_name
    }
  } else {
    if (user.id === -1) {
      initial = 'N/A'
    } else {
      initial = user.first_name.substr(0, 1) + user.last_name.substr(0, 1)
    }
  }

  return (
    <div
      title={initial}
      key={user.id}
      className={classnames(styles.user, short && styles.short)}>
      {user.user_photo ? (
        <img src={user.user_photo} className={styles.photo} alt={initial} />
      ) : (
        <UserAvatar />
      )}
      {/* <span>{initial}</span> */}
    </div>
  )
}

export default UserWithTooltip
