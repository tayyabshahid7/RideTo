import React from 'react'
import classnames from 'classnames'

import styles from './DetailsAccordionItem.scss'

const DetailsAccordionItem = ({ title, content, isOpen, onToggle }) => {
  const contentClassName = classnames(styles.content, isOpen && styles.open)

  return (
    <div className={styles.detailsAccordionItem}>
      <div className={styles.heading} onClick={() => onToggle(!isOpen)}>
        <div className={styles.title}>{title}</div>
        <div className={styles.action} />
      </div>
      <div className={contentClassName}>{content}</div>
    </div>
  )
}

export default DetailsAccordionItem
