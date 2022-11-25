import StarEmpty from 'assets/images/StarYellowEmpty.svg'
import Star from 'assets/images/StarYellowFull.svg'
import classnames from 'classnames'
import React from 'react'
import styles from './styles.scss'

const YellowStarsComponent = ({
  rating = 5,
  className = '',
  starClassName = '',
  onClick
}) => (
  <div className={classnames(styles.container, className)} onClick={onClick}>
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

export default YellowStarsComponent
