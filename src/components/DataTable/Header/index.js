import React from 'react'

import styles from './Header.scss'

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.handleSort = this.handleSort.bind(this)
  }

  handleSort(event) {
    const { column, ordering, onSort } = this.props
    if (!onSort) {
      return
    }

    if (ordering === column) {
      onSort(`-${column}`, event.shiftKey)
    } else {
      onSort(column, event.shiftKey)
    }
  }

  render() {
    const { children, column = '', ordering = '' } = this.props
    const direction = ordering.indexOf('-') === 0 ? 'asc' : 'desc'
    const className =
      column && ordering.slice(-column.length) === column
        ? `${styles.header} ${styles[direction]}`
        : styles.header

    return (
      <th className={className} name={column} onClick={this.handleSort}>
        {children}
      </th>
    )
  }
}

export default Header
