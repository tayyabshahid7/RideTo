import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'

const SearchTag = ({ text }) => {
  return <span className={classnames(styles.container)}>{text}</span>
}

export default SearchTag
