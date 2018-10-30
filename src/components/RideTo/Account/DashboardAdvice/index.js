import React from 'react'

import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import styles from './DashboardAdvice.scss'

const DashboardAdvice = ({ items }) => {
  return (
    <div className={styles.dashboardAdvice}>
      <h4>Latest Advice and Guides</h4>
      {items.map(item => (
        <a href={`/blog/${item.slug}`} className={styles.item} key={item.id}>
          <img className={styles.image} src={item.image} alt="" />
          <div className={styles.title}>
            {item.title}
            <img src={ArrowRight} alt="" />
          </div>
        </a>
      ))}
    </div>
  )
}

export default DashboardAdvice
