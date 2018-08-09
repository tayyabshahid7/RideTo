import React from 'react'

import { DayPicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'

import SchoolSelect from 'components/SchoolSelect/SchoolSelect'

import styles from './BookingOptions.scss'

class BookingOptions extends React.Component {
  render() {
    const { selectedLocation, locations, onChangeLocation } = this.props

    return (
      <div className={styles.bookingOptions}>
        <h2>Booking Options</h2>

        <DayPicker
          numberOfMonths={1}
          onDayClick={day => {
            console.log(day)
          }}
          onFocusChange={() => {}}
        />

        <SchoolSelect
          schools={locations}
          selected={selectedLocation.id}
          onChange={onChangeLocation}
        />
      </div>
    )
  }
}

export default BookingOptions
