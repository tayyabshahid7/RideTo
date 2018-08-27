import React from 'react'

import styles from './Header.scss'

class Header extends React.Component {
  handleSort(event) {
    console.log(event)
  }

  render() {
    const { children, name, onSort } = this.props

    return (
      <th className={styles.header} name={name} onClick={e => onSort(name)}>
        {children}
      </th>
    )
  }
}

export default Header
