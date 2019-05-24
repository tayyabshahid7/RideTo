import React from 'react'
import containerStyles from '../styles.scss'
import componentStyles from './styles.scss'

const styles = {
  ...containerStyles,
  ...componentStyles
}

function BikeReview({ match, bikes }) {
  const { image, name } = bikes.find(
    bike => bike.id === parseInt(match.params.id, 10)
  )

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.largeImage}>
            <img src={image} alt="Large product" />
          </div>
          <div className={styles.keyInfo}>
            <div>
              <div>
                <h1>{name}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BikeReview
