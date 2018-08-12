import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'

import Calendar from 'pages/Widget/components/Calendar'
import MotorbikeOptions from 'pages/Widget/components/MotorbikeOptions'
import CourseSelect from 'pages/Widget/components/CourseSelect'
import BookingOption from 'pages/Widget/components/BookingOption'
import { fetchWidgetCourses } from 'services/course'

import styles from './BookingOptions.scss'

const getSchoolCoursesByDate = (selectedDate, courses) => {
  if (!selectedDate) {
    return []
  }
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
      selectedDate: null,
      selectedBikeHire: null,
      month: moment().startOf('month'),
      isLoading: true
    }

    this.handleChangeCourseType = this.handleChangeCourseType.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleChangeCourse = this.handleChangeCourse.bind(this)
    this.handleChangeMonth = this.handleChangeMonth.bind(this)
    this.handleSelectBikeHire = this.handleSelectBikeHire.bind(this)
  }

  componentDidMount() {
    const { month } = this.state
    this.fetchCourses(month.clone())
  }

  componentDidUpdate(oldProps) {
    if (oldProps.selectedLocation !== this.props.selectedLocation) {
      const { month } = this.state
      this.setState({ isLoading: true })
      this.fetchCourses(month.clone())
    }
  }

  async fetchCourses(month) {
    const { selectedLocation } = this.props
    const courseType = this.state.courseType || selectedLocation.courses[0]
    const schoolCourses = await fetchWidgetCourses(
      selectedLocation.id,
      month
        .subtract(1, 'month')
        .startOf('month')
        .format('YYYY-MM-DD'),
      month
        .add(2, 'month')
        .endOf('month')
        .format('YYYY-MM-DD')
    )

    this.setAvailableCourses(schoolCourses, courseType)
  }

  setAvailableCourses(schoolCourses, courseType) {
    const availableCourses = schoolCourses.filter(
      ({ course_type, order_count, spaces }) => {
        return course_type.id === courseType.id && order_count < spaces
      }
    )

    this.setState({
      schoolCourses,
      availableCourses,
      courseType,
      isLoading: false
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
    const selectedCourses = getSchoolCoursesByDate(
      selectedDate,
      this.state.availableCourses
    )

    this.setState({
      selectedDate,
      selectedCourse: selectedCourses[0]
    })
  }

  handleChangeCourse(selectedCourse) {
    this.setState({
      selectedCourse
    })
  }

  handleChangeMonth(month) {
    this.setState({ month })
    this.fetchCourses(month.clone())
  }

  handleSelectBikeHire(selectedBikeHire) {
    this.setState({ selectedBikeHire })
  }

  render() {
    const {
      widget,
      slug,
      selectedLocation,
      locations,
      onChangeLocation
    } = this.props
    const {
      courseType,
      availableCourses,
      selectedDate,
      selectedCourse,
      selectedBikeHire,
      isLoading
    } = this.state
    const selectedCourses = getSchoolCoursesByDate(
      selectedDate,
      availableCourses
    )
    const url = selectedCourse
      ? `/widget/${slug}/payment/${selectedCourse.id}?hire=${selectedBikeHire}`
      : null

    return (
      <div className={styles.bookingOptions}>
        <BookingOption
          label="Training:"
          options={selectedLocation.courses}
          selected={courseType.id}
          onChange={this.handleChangeCourseType}
        />

        <BookingOption
          label="Location:"
          options={locations}
          labelField="address_1"
          selected={selectedLocation.id}
          onChange={onChangeLocation}
        />

        <Calendar
          color={widget.calendar_color}
          date={selectedDate}
          courses={availableCourses}
          onChangeDate={this.handleChangeDate}
          onChangeMonth={this.handleChangeMonth}
          isLoading={isLoading}
        />

        <hr />

        {selectedCourse ? (
          <React.Fragment>
            <CourseSelect
              date={selectedDate}
              courses={selectedCourses}
              selectedCourse={selectedCourse}
              color={widget.button_color}
              onChangeCourse={this.handleChangeCourse}
            />

            <hr />

            <MotorbikeOptions
              selected={selectedBikeHire}
              course={selectedCourse}
              onChange={this.handleSelectBikeHire}
            />

            <hr />

            <Link to={url}>Continue</Link>
          </React.Fragment>
        ) : null}
      </div>
    )
  }
}

export default BookingOptions
