import React from 'react'
import { SingleDatePicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'

import MinimalSelect from 'components/MinimalSelect'
import { fetchWidgetCourses } from 'services/course'

import styles from './BookingOptions.scss'

const renderDayContents = (day, price) => {
  return (
    <div className={styles.day}>
      <div className={styles.dayDate}>{day.format('DD')}</div>
      <strong className={styles.dayPrice}>{`£${price}`}</strong>
    </div>
  )
}

const getAvailableDates = schoolCourses => {
  return schoolCourses.map(schoolCourse => schoolCourse.date)
}

const isDayBlocked = (day, availableDates) => {
  return availableDates.indexOf(day.format('YYYY-MM-DD')) === -1
}

class BookingOptions extends React.Component {
  constructor(props) {
    super(props)
    const { selectedLocation } = props

    this.state = {
      courseType: selectedLocation.courses[0],
      availableDates: [],
      schoolCourses: [],
      availableCourses: []
    }

    this.handleChangeCourseType = this.handleChangeCourseType.bind(this)
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
    const courseType = this.state.courseType || selectedLocation.courses[0]
    const schoolCourses = await fetchWidgetCourses(
      selectedLocation.id,
      '2018-01-01',
      '2018-12-31'
    )

    this.setAvailableCourses(schoolCourses, courseType)
  }

  setAvailableCourses(schoolCourses, courseType) {
    const availableCourses = schoolCourses.filter(
      ({ course_type }) => course_type.id === courseType.id
    )

    this.setState({
      schoolCourses,
      availableCourses,
      availableDates: getAvailableDates(availableCourses),
      courseType
    })
  }

  handleChangeCourseType(courseTypeId) {
    const { selectedLocation } = this.props
    const courseType = selectedLocation.courses.filter(
      ({ id }) => id === parseInt(courseTypeId, 10)
    )[0]

    this.setAvailableCourses(this.state.schoolCourses, courseType)
  }

  render() {
    const { selectedLocation, locations, onChangeLocation } = this.props
    const { courseType, availableDates } = this.state

    return (
      <div className={styles.bookingOptions}>
        <SingleDatePicker
          numberOfMonths={1}
          renderDayContents={day => renderDayContents(day, 120)}
          onDateChange={day => {
            console.log(day)
          }}
          daySize={48}
          onFocusChange={() => {}}
          keepOpenOnDateSelect={true}
          hideKeyboardShortcutsPanel={true}
          focused={true}
          isDayBlocked={day => isDayBlocked(day, availableDates)}
        />

        <div className={styles.training}>
          <h4>Training</h4>
          <MinimalSelect
            options={selectedLocation.courses}
            selected={courseType.id}
            onChange={this.handleChangeCourseType}
          />
        </div>

        <div className={styles.locations}>
          <h4>Location</h4>
          <MinimalSelect
            options={locations}
            labelField="address_1"
            selected={selectedLocation.id}
            onChange={onChangeLocation}
          />
        </div>
      </div>
    )
  }
}

export default BookingOptions
