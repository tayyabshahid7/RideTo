import React from 'react'
import classnames from 'classnames'

import Checkbox from 'components/Checkbox'
import styles from './DashboardChecklist.scss'

const DashboardChecklist = ({ items }) => {
  return (
    <div className={styles.dashboardChecklist}>
      <h4>My Checklist</h4>

      {items.map(item => (
        <div
          className={classnames(styles.item, item.checked && styles.checked)}>
          <a href={item.href} target="_blank">
            <Checkbox
              extraClass={styles.checkbox}
              size="large"
              checked={item.checked}
              name={item.text}>
              {item.text}
            </Checkbox>
          </a>
        </div>
      ))}
    </div>
  )
}

export default DashboardChecklist
