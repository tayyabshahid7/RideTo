import React from 'react'
import classnames from 'classnames'

import styles from './Notification.scss'

const getIcon = color => {
  switch (color) {
    case 'success':
      return <i className="fa fa-check-circle" />
    case 'danger':
      return <i className="fa fa-exclamation-circle" />
    default:
      return null
  }
}

const Notification = ({ notification, onClick }) => {
  const { title, content, color } = notification
  const className = classnames(styles.notification, styles[color])

  return (
    <div className={className} onClick={onClick}>
      <div className={styles.icon}>{getIcon(color)}</div>
      <div className={styles.body}>
        <h5>{title}</h5>
        <div className={content}>{content}</div>
      </div>
      <div className={styles.dismiss}>
        <i className="fa fa-times" />
      </div>
    </div>
  )
}

export default Notification
