import InstantBookingIcon from 'assets/icons/IconInstantBookingWhite.svg'
import React from 'react'
import styles from './NewIconMapPin.scss'

const NewIconMapPin = props => {
  const { pricing, isInstantBooking = false, handlePinClick, course } = props

  return (
    <div
      className={styles.container}
      onClick={() => {
        handlePinClick(course, 3)
      }}>
      <div>
        {isInstantBooking && <img src={InstantBookingIcon} alt="" />}
        <span className={styles.pinPrice}>{pricing}</span>
      </div>

      <div className={styles.triangleTopLeft} />
    </div>
  )
}
export default NewIconMapPin
