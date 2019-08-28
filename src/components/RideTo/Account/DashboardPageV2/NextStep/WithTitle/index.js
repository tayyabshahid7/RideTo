import React from 'react'
import styles from './styles.scss'

function WithTitle({ title, children }) {
  return (
    <div>
      <h3 className={styles.subtitle}>{title}</h3>
      {children}
    </div>
  )
}

export default WithTitle
