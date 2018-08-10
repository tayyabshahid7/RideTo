import React from 'react'
import moment from 'moment'

import Calendar from 'pages/Widget/components/Calendar'
import CourseSelect from 'pages/Widget/components/CourseSelect'
import MinimalSelect from 'components/MinimalSelect'
import { fetchWidgetCourses } from 'services/course'

import styles from './BookingOptions.scss'

const getSchoolCoursesByDate = (selectedDate, courses) => {
  const formatted = selectedDate.format('YYYY-MM-DD')

  return courses.filter(({ date }) => date === formatted)
}

class BookingOptions extends React.Component {
  constructor(props) {
    super(props)
    const { selectedLocation } = props

    this.state = {
      courseType: selectedLocation.courses[0],
      schoolCourses: [],
      availableCourses: [],
      selectedCourse: null,
      selectedDate: moment()
    }

    this.handleChangeCourseType = this.handleChangeCourseType.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
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

  handleChangeDate(selectedDate) {
    this.setState({
      selectedDate
    })
  }

  handleChangeCourse(selectedCourse) {
    this.setState({
      selectedCourse
    })
  }

  render() {
    const { widget, selectedLocation, locations, onChangeLocation } = this.props
    const {
      courseType,
      availableCourses,
      selectedDate,
      selectedCourse
    } = this.state
    const selectedCourses = getSchoolCoursesByDate(
      selectedDate,
      availableCourses
    )

    return (
      <div className={styles.bookingOptions}>
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

        <Calendar
          color={widget.calendar_color}
          date={selectedDate}
          courses={availableCourses}
          onChangeDate={this.handleChangeDate}
        />

        <hr />

        {selectedCourses.length ? (
          <CourseSelect
            courses={selectedCourses}
            selectedCourse={selectedCourse}
            color={widget.button_color}
            onChangeCourse={this.handleChangeCourse}
          />
        ) : null}
      </div>
    )
  }
}

export default BookingOptions
