import React from 'react'
import classnames from 'classnames'

import Checkbox from 'components/Checkbox'
import styles from './DashboardChecklist.scss'

const DashboardChecklist = ({ items }) => {
  return (
    <div className={styles.dashboardChecklist}>
      <h4>My Checklist</h4>

      {items.map((item, index) => (
        <a
          key={index}
          className={classnames(styles.item, item.checked && styles.checked)}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer">
          <Checkbox
            extraClass={styles.checkbox}
            size="large"
            checked={item.checked}
            name={item.text}>
            <span className={styles.checkLinks}>{item.text}</span>
          </Checkbox>
        </a>
      ))}
    </div>
  )
}

export default DashboardChecklist
