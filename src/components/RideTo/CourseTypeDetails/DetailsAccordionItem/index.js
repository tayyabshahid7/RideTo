import React from 'react'
import classnames from 'classnames'

import styles from './DetailsAccordionItem.scss'
import expandImg from 'assets/images/rideto/Expand.svg'
import closeImg from 'assets/images/rideto/CloseDark.svg'

const DetailsAccordionItem = ({ title, content, isOpen, onToggle }) => {
  const contentClassName = classnames(styles.content, isOpen && styles.open)

  return (
    <div className={styles.detailsAccordionItem}>
      <div className={styles.heading} onClick={() => onToggle(!isOpen)}>
        <div className={styles.title}>{title}</div>
        <div className={styles.action}>
          {isOpen ? (
            <img src={closeImg} alt="Close" />
          ) : (
            <img src={expandImg} alt="Open" />
          )}
        </div>
      </div>
      <div className={contentClassName}>{content}</div>
    </div>
  )
}

export default DetailsAccordionItem
