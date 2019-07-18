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
  className,
  spacedOut,
  fullLicenceFaqs,
  children,
  titleStyle,
  contentStyle
}) => {
  const contentClassName = classnames(styles.content, isOpen && styles.open)
  return (
    <div
      className={classnames(
        styles.detailsAccordionItem,
        spacedOut && styles.detailsAccordionItemSpaced,
        fullLicenceFaqs && styles.detailsAccordionFullLicenceFaqs,
        className
      )}>
      <div className={styles.heading} onClick={() => onToggle(!isOpen)}>
        <div className={styles.title} style={titleStyle}>
          {title}
        </div>
        <div className={styles.action}>
          {isOpen ? (
            <img src={closeImg} alt="Close" />
          ) : (
            <img src={expandImg} alt="Open" />
          )}
        </div>
      </div>
      {typeof content === 'string' ? (
        <div
          className={contentClassName}
          style={contentStyle}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div className={contentClassName} style={contentStyle}>
          {children}
        </div>
      )}
    </div>
  )
}

export default DetailsAccordionItem
