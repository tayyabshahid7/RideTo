import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'
import Star from 'assets/images/Star.svg'
import StarEmpty from 'assets/images/StarEmpty.svg'

const StarsComponent = ({ rating = 5, className = '', starClassName = '' }) => (
  <div className={classnames(styles.container, className)}>
    {[1, 2, 3, 4, 5].map((num, index) => (
      <div key={index} className={starClassName}>
        {rating >= num ? (
          <img src={Star} alt="star" />
        ) : num - rating < 0.6 ? (
          <img src={Star} alt="star" />
        ) : (
          <img src={StarEmpty} alt="star" />
        )}
      </div>
    ))}
  </div>
)

export default StarsComponent
