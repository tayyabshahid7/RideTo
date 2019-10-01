import React, { Fragment } from 'react'
import styles from './styles.scss'
import buttonArrowWhite from 'assets/images/rideto/ButtonArrowWhiteThick.svg'

function CourseTypeLandingForm({ search, handleSubmit, handleInputChange }) {
  return (
    <Fragment>
      <h4 className={styles.bookLocal}>Book a local instructor</h4>
      <form className={styles.bookForm} onSubmit={handleSubmit}>
        <input
          onChange={handleInputChange}
          placeholder="Your postcode"
          type="text"
          value={search}
        />
        <button>
          Search{' '}
          <img
            src={buttonArrowWhite}
            alt="Arrow right"
            width="16"
            height="11"
          />
        </button>
      </form>
    </Fragment>
  )
}

export default CourseTypeLandingForm
