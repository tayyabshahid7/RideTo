import React from 'react'
import styles from './styles.scss'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import RideToButton from 'components/RideTo/Button'

function Ready() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ready to get started?</h2>
      <form
        className={styles.form}
        action="/course-type-selection"
        method="get">
        <input
          className={styles.input}
          placeholder="Enter a place or postcode"
        />
        <RideToButton
          className={styles.button}
          type="submit"
          title="Learn to ride">
          <span>Learn to ride</span>
          <img src={ButtonArrowWhite} alt="Submit" />
        </RideToButton>
      </form>
    </div>
  )
}

export default Ready
