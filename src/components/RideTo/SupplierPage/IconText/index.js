import React from 'react'
import classnames from 'classnames'
import styles from './IconText.scss'

const IconText = ({ icon, text, underlined }) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <span
        className={classnames(styles.text, underlined && styles.underlined)}>
        {text}
      </span>
    </div>
  )
}

export default IconText
