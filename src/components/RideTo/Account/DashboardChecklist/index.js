import React from 'react'
import classnames from 'classnames'

import Checkbox from 'components/Checkbox'
import styles from './DashboardChecklist.scss'

const DashboardChecklist = ({ items }) => {
  return (
    <div className={styles.dashboardChecklist}>
      <h4>My Checklist</h4>

      {items.map((item, index) => (
        <div
          key={index}
          className={classnames(styles.item, item.checked && styles.checked)}>
          <Checkbox
            extraClass={styles.checkbox}
            size="large"
            checked={item.checked}
            name={item.text}>
            <a href={item.href} target="_blank" className={styles.checkLinks}>
              {item.text}
            </a>
          </Checkbox>
        </div>
      ))}
    </div>
  )
}

export default DashboardChecklist
