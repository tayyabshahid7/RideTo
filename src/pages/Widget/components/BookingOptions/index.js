import React from 'react'

import { DayPicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'

import SchoolSelect from 'components/SchoolSelect/SchoolSelect'
import { fetchWidgetCourses } from 'services/course'

import styles from './BookingOptions.scss'

class BookingOptions extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      courses: []
    }
  }

  componentDidMount() {
    this.fetchCourses()
  }

  componentDidUpdate(oldProps) {
    if (oldProps.selectedLocation !== this.props.selectedLocation) {
      this.fetchCourses()
    }
  }

  async fetchCourses() {
    const { selectedLocation } = this.props
    const courses = await fetchWidgetCourses(
      selectedLocation.id,
      '2018-01-01',
      '2018-12-31'
    )

    this.setState({ courses })
  }

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
          labelField="address_1"
          selected={selectedLocation.id}
          onChange={onChangeLocation}
        />
      </div>
    )
  }
}

export default BookingOptions
