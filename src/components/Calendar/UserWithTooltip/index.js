import React from 'react'
import classnames from 'classnames'
import styles from './index.scss'
import { UserAvatar } from '../../../assets/icons'

const UserWithTooltip = ({ user, right = false }) => {
  let initial

  if (user.id === -1) {
    initial = 'Unassigned'
  } else {
    initial = user.first_name + ' ' + user.last_name
  }

  return (
    <div
      title={initial}
      key={user.id}
      className={classnames(styles.user, right && styles.right)}>
      <div className={styles.content}>
        {user.user_photo ? (
          <img src={user.user_photo} className={styles.photo} alt={initial} />
        ) : (
          <UserAvatar />
        )}
        <h5 className={classnames('detail')}>
          <span>{initial}</span>
        </h5>
      </div>
    </div>
  )
}

export default UserWithTooltip
