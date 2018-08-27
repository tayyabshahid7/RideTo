import React from 'react'

import styles from './Cell.scss'

const Cell = ({ children }) => {
  return <td className={styles.cell}>{children}</td>
}

export default Cell
