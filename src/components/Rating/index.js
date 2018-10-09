import React from 'react'

import Star from 'assets/images/Star.svg'
import StarEmpty from 'assets/images/StarEmpty.svg'
import styles from './Rating.scss'

const RATINGS = [1, 2, 3, 4, 5]

const Rating = ({ rating, onChange }) => {
  return (
    <div className={styles.rating}>
      {RATINGS.map(
        r =>
          r <= rating ? (
            <img src={Star} alt="" onClick={() => onChange(r)} />
          ) : (
            <img src={StarEmpty} alt="" onClick={() => onChange(r)} />
          )
      )}
    </div>
  )
}

export default Rating
