import React from 'react'

import styles from './styles.scss'

const StaticSidePanel = ({ children }) => {
  return <div className={styles.container}>{children}</div>
}

export default StaticSidePanel
