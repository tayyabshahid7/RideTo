import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'

const ColorTag = ({ text, type }) => {
  return (
    <span className={classnames(styles.container, `bgcolor-${type}`)}>
      {text}
    </span>
  )
}

export default ColorTag
