import classnames from 'classnames'
import React from 'react'
import styles from './CancellationReason.scss'

const VALUES = [
  {
    value: 'I didn’t get the date I wanted',
    constant: 'CANCELLATION_DATE_UNAVAILABLE'
  },
  {
    value: 'I’ve had a change of plans',
    constant: 'CANCELLATION_CHANGE_OF_MIND'
  },
  { value: 'I booked the wrong course', constant: 'CANCELLATION_WRONG_COURSE' },
  {
    value: 'I’ve made another booking with RideTo',
    constant: 'CANCELLATION_DUPLICATE_BOOKING'
  },
  {
    value: 'I booked a course with someone else',
    constant: 'CANCELLATION_BOOKED_ELSEWHERE'
  },
  { value: 'Other', constant: 'CANCELLATION_OTHER' }
]

function CancellationReasonSelect({ value, onChange, placeholder }) {
  const warn =
    value === 'NO_SET' || value === undefined
      ? classnames(styles.select, styles.warn)
      : styles.select

  return (
    <select className={warn} value={value} onChange={onChange}>
      <option value="">{placeholder}</option>
      {VALUES.map(item => (
        <option value={item.constant} key={item.constant}>
          {item.value.toLocaleString()}
        </option>
      ))}
    </select>
  )
}

export default CancellationReasonSelect
