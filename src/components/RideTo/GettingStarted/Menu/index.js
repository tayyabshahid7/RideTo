import React from 'react'
import styles from './styles.scss'
import classnames from 'classnames'

function Menu({ names, currentSection, scrollTo }) {
  return (
    <div className={styles.menu}>
      <ul className={styles.menuList}>
        {names.map((name, i) => (
          <li
            key={name}
            className={classnames(
              styles.menuListItem,
              currentSection === i && styles.menuListItemCurrent
            )}>
            <button
              className={styles.menuListButton}
              onClick={() => {
                scrollTo(i)
              }}>
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Menu
