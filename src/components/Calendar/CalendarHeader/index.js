import React from 'react'
import moment from 'moment'
// import styles from './index.scss'
// import classnames from 'classnames'

const CalendarHeader = ({ info }) => (
  <header>
    <h1>{moment(new Date(info.year, info.month, 1)).format('MMMM YYYY')}</h1>
  </header>
)

export default CalendarHeader
