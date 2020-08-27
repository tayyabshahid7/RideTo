import React from 'react'
import classnames from 'classnames'
import styles from './index.scss'
import { UserAvatar } from '../../../assets/icons'

const UserInitial = ({
  user,
  short = false,
  minimized = false,
  wide,
  right = false,
  noPadding = false
}) => {
  let initial
  let username = ''
  if (user.id === -1) {
    username = 'Unassigned'
  } else {
    username = user.first_name + ' ' + user.last_name
  }

  if (!short) {
    initial = username
  } else {
    if (user.id === -1) {
      initial = 'N/A'
    } else {
      initial = user.first_name.substr(0, 1) + user.last_name.substr(0, 1)
    }
  }

  return (
    <div
      key={user.id}
      className={classnames(
        styles.user,
        right && styles.right,
        short && styles.short,
        wide && styles.wide,
        noPadding && styles.noPadding,
        minimized && styles.minimized
      )}>
      <div className={styles.content}>
        {user.user_photo ? (
          <img src={user.user_photo} className={styles.photo} alt={initial} />
        ) : (
          <UserAvatar />
        )}
        {!minimized && <span>{initial}</span>}
        <h5 className={classnames('detail')}>
          <span>{username}</span>
        </h5>
      </div>
    </div>
  )
}

export default UserInitial
