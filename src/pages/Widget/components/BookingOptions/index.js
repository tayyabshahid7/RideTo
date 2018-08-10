import React from 'react'

import { DayPicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'

import MinimalSelect from 'components/MinimalSelect'
import { fetchWidgetCourses } from 'services/course'

import styles from './BookingOptions.scss'

class BookingOptions extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      courses: [],
      selectedCourse: {}
    }

    this.handleChangeCourse = this.handleChangeCourse.bind(this)
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

  handleChangeCourse(courseId) {
    const { selectedLocation } = this.props
    const selectedCourse = selectedLocation.courses.filter(
      ({ id }) => id === parseInt(courseId, 10)
    )[0]

    this.setState({ selectedCourse })
  }

  render() {
    const { selectedLocation, locations, onChangeLocation } = this.props
    const { selectedCourse } = this.state

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

        <MinimalSelect
          options={locations}
          labelField="address_1"
          selected={selectedLocation.id}
          onChange={onChangeLocation}
        />

        <MinimalSelect
          options={selectedLocation.courses}
          selected={selectedCourse.id}
          onChange={this.handleChangeCourse}
        />
      </div>
    )
  }
}

export default BookingOptions
