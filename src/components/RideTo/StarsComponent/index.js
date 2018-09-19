import React from 'react'
import classnames from 'classnames'
import styles from './styles.scss'

const StarsComponent = ({ rating = 5, className = '', starClassName = '' }) => (
  <div className={classnames(styles.container, className)}>
    {[1, 2, 3, 4, 5].map((num, index) => (
      <div key={index} className={starClassName}>
        {rating >= num ? (
          <i className="fa fa-star" />
        ) : num - rating < 0.6 ? (
          <i className="fa fa-star-half-o" />
        ) : (
          <i className="fa fa-star-o" />
        )}
      </div>
    ))}
  </div>
)

export default StarsComponent
