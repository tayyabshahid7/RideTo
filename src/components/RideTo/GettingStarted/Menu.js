import React from 'react'
import styles from './styles.scss'

function Menu({ currentSection }) {
  return (
    <div className={styles.menu}>
      <span className={styles.menuCurrent}>{currentSection}</span>
    </div>
  )
}

export default Menu
