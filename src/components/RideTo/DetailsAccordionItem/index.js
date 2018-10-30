import React from 'react'
import classnames from 'classnames'

import styles from './DetailsAccordionItem.scss'
import expandImg from 'assets/images/rideto/Expand.svg'
import closeImg from 'assets/images/rideto/CloseDark.svg'

const DetailsAccordionItem = ({
  title,
  content,
  isOpen,
  onToggle,
  className
}) => {
  const contentClassName = classnames(styles.content, isOpen && styles.open)
  return (
    <div className={classnames(styles.detailsAccordionItem, className)}>
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
      <div
        className={contentClassName}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default DetailsAccordionItem
