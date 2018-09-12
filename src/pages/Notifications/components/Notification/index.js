import React from 'react'
import classnames from 'classnames'

import styles from './Notification.scss'

const Notification = ({ notification }) => {
  const { title, content, color } = notification
  const className = classnames(styles.notification, styles[color])

  return (
    <div className={className}>
      <h5>{title}</h5>
      <div className={content}>{content}</div>
    </div>
  )
}

export default Notification
