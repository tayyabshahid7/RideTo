import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'

import CourseAvailabilityComponentFullLicence from 'components/RideTo/ResultPage/CourseDetailPanel/CourseAvailabilityComponentFullLicence.js'
// import CalendarFullLicence from 'pages/Widget/components/CalendarFullLicence'
import Calendar from 'pages/Widget/components/Calendar'
import MotorbikeOptions from 'pages/Widget/components/MotorbikeOptions'
import CourseSelect from 'pages/Widget/components/CourseSelect'
import BookingOption from 'pages/Widget/components/BookingOption'
import { fetchWidgetCourses } from 'services/course'
import {
  showOwnBikeHire,
  getTotalOrderPrice,
  asPoundSterling
} from 'services/widget'
import { getPackageDays, isAnyPackageDatesSelected } from 'common/info'

import styles from './BookingOptionsContainer.scss'

const getSchoolCoursesByDate = (selectedDate, courses) => {
  if (!selectedDate) {
    return []
  }
  const formatted = selectedDate.format('YYYY-MM-DD')

  return courses.filter(({ date }) => date === formatted)
}

const getEarliestDate = courses => {
  const dates = courses.map(({ date }) => date).sort()

  return dates.length ? moment(dates[0], 'YYYY-MM-DD') : null
}

class BookingOptionsContainer extends React.Component {
  constructor(props) {
    super(props)
    const { selectedSupplier } = props

    this.state = {
      courseType: selectedSupplier.courses[0],
      schoolCourses: [],
      availableCourses: [],
      selectedCourse: null,
      selectedDate: null,
      selectedBikeHire: 'no',
      month: moment().startOf('month'),
      isLoading: true,
      isFullLicence: selectedSupplier.courses[0].constant === 'FULL_LICENCE',
      selectedLicenceType: null,
      selectedPackageDays: '',
      selectedPackageDates: []
    }

    this.handleChangeCourseType = this.handleChangeCourseType.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleChangeCourse = this.handleChangeCourse.bind(this)
    this.handleChangeMonth = this.handleChangeMonth.bind(this)
    this.handleSelectBikeHire = this.handleSelectBikeHire.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onSelectPackageDays = this.onSelectPackageDays.bind(this)
    this.onSelectPackageDate = this.onSelectPackageDate.bind(this)

    window.document.body.scrollIntoView()
  }

  componentDidMount() {
    const { month } = this.state
    this.fetchCourses(month.clone())
  }

  componentDidUpdate(oldProps) {
    if (oldProps.selectedSupplier !== this.props.selectedSupplier) {
      const { month } = this.state
      this.setState({ isLoading: true })
      this.fetchCourses(month.clone())
    }
  }

  async fetchCourses(month) {
    const { selectedSupplier } = this.props
    const courseType = this.state.courseType || selectedSupplier.courses[0]
    const schoolCourses = await fetchWidgetCourses(
      selectedSupplier.id,
      month.startOf('month').format('YYYY-MM-DD'),
      month
        .add(6, 'month')
        .endOf('month')
        .format('YYYY-MM-DD')
    )

    this.setAvailableCourses(schoolCourses, courseType)
  }

  setAvailableCourses(schoolCourses, courseType) {
    const availableCourses = schoolCourses.filter(
      ({ course_type, training_count, spaces }) => {
        return course_type.id === courseType.id && training_count < spaces
      }
    )
    const selectedDate = getEarliestDate(availableCourses)
    const selectedCourses = getSchoolCoursesByDate(
      selectedDate,
      availableCourses
    )

    const isFullLicence = courseType.constant === 'FULL_LICENCE'

    let selectedBikeHire = showOwnBikeHire(courseType) ? 'no' : 'auto'

    if (isFullLicence) {
      selectedBikeHire = ''
    }

    this.setState({
      schoolCourses,
      selectedDate,
      selectedCourse: selectedCourses[0],
      selectedBikeHire,
      availableCourses,
      courseType,
      isLoading: false,
      isFullLicence
    })
  }

  handleChangeCourseType(courseTypeId) {
    const { selectedSupplier } = this.props
    const courseType = selectedSupplier.courses.filter(
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
      selectedCourse: selectedCourses[0],
      selectedBikeHire: showOwnBikeHire(this.state.courseType) ? 'no' : 'auto'
    })
  }

  handleChangeCourse(selectedCourse) {
    this.setState({
      selectedCourse,
      selectedBikeHire: showOwnBikeHire(this.state.courseType) ? 'no' : 'auto'
    })
  }

  handleChangeMonth(date) {
    const month = date.startOf('month')
    this.setState({ month })
  }

  handleSelectBikeHire(selectedBikeHire) {
    this.setState({ selectedBikeHire })
  }

  onUpdate(data) {
    const { isFullLicence, selectedPackageDates } = this.state

    if (
      isFullLicence &&
      (data.hasOwnProperty('bike_hire') ||
        data.hasOwnProperty('selectedLicenceType') ||
        data.hasOwnProperty('selectedPackageDays')) &&
      isAnyPackageDatesSelected(selectedPackageDates) &&
      !window.confirm('Changing this will unset any dates')
    ) {
      return
    }

    const newState = { ...data }

    if (data.bike_hire) {
      newState.selectedBikeHire = data.bike_hire
    }

    this.setState(newState)
  }

  onSelectPackageDays(days) {
    const packageDays = getPackageDays(days)

    this.onUpdate({
      selectedPackageDays: days,
      selectedPackageDates: packageDays
    })
  }

  onSelectPackageDate(index, { date, course_id, time }) {
    const newDates = [...this.state.selectedPackageDates]

    if (
      newDates[index + 1] &&
      newDates[index + 1].date !== '' &&
      !window.confirm('Changing this will unset subsequent dates')
    ) {
      return
    }

    newDates[index].course_id = course_id
    newDates[index].date = date
    newDates[index].time = time
    newDates.forEach((date, i) => {
      if (i > index) {
        date.course_id = null
        date.date = ''
        date.time = ''
      }
    })

    this.setState({
      selectedPackageDates: newDates
    })
  }

  getTotalPrice() {
    const { selectedCourse, selectedBikeHire } = this.state
    if (selectedCourse && selectedCourse.pricing) {
      return asPoundSterling(
        getTotalOrderPrice(selectedCourse, selectedBikeHire)
      )
    }

    return ' - '
  }

  render() {
    const {
      widget,
      slug,
      selectedSupplier,
      suppliers,
      onChangeSupplier
    } = this.props
    const {
      courseType,
      availableCourses,
      selectedDate,
      selectedCourse,
      selectedBikeHire,
      selectedLicenceType,
      selectedPackageDays,
      selectedPackageDates,
      isLoading,
      isFullLicence
    } = this.state
    const selectedCourses = getSchoolCoursesByDate(
      selectedDate,
      availableCourses
    )
    const url = selectedCourse
      ? `/widget/${slug}/payment/${selectedCourse.id}?hire=${selectedBikeHire}`
      : null

    if (!courseType) {
      return <div className={styles.bookingOptions}>No Course Found</div>
    }

    return (
      <div className={styles.bookingOptions}>
        <BookingOption
          label="Training:"
          options={selectedSupplier.courses}
          selected={courseType.id}
          onChange={this.handleChangeCourseType}
        />

        <BookingOption
          label="Location:"
          options={suppliers}
          labelField="address_1"
          selected={selectedSupplier.id}
          onChange={onChangeSupplier}
        />

        {!isFullLicence ? (
          <Calendar
            color={widget.calendar_color}
            date={selectedDate}
            courses={availableCourses}
            onChangeDate={this.handleChangeDate}
            onChangeMonth={this.handleChangeMonth}
            isLoading={isLoading}
          />
        ) : (
          <CourseAvailabilityComponentFullLicence
            isWidget
            course={selectedSupplier}
            bike_hire={selectedBikeHire}
            onUpdate={this.onUpdate}
            onSelectPackage={this.onSelectPackageDays}
            onSelectPackageDate={this.onSelectPackageDate}
            selectedLicenceType={selectedLicenceType}
            selectedPackageDays={selectedPackageDays}
            selectedPackageDates={selectedPackageDates}
          />
        )}

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
              ownBike={showOwnBikeHire(courseType)}
              selected={selectedBikeHire}
              course={selectedCourse}
              onChange={this.handleSelectBikeHire}
            />

            <hr />

            <div className={styles.totalPrice}>
              Total Price: {this.getTotalPrice()}
            </div>

            <hr />

            <Link to={url} className="WidgetBtn">
              Book Now
            </Link>
          </React.Fragment>
        ) : null}
      </div>
    )
  }
}

export default BookingOptionsContainer
