import React from 'react'
import moment from 'moment'
import { Redirect } from 'react-router-dom'

import CourseAvailabilityComponentFullLicence from 'components/RideTo/ResultPage/CourseDetailPanel/CourseAvailabilityComponentFullLicence.js'
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
import {
  getPackageDays,
  isAnyPackageDatesSelected,
  isAllPackageDatesSelected
} from 'common/info'
import { LICENCE_TYPES } from 'common/constants'

import styles from './BookingOptionsContainer.scss'

const getSchoolCoursesByDate = (selectedDate, courses) => {
  if (!selectedDate) {
    return []
  }
  const formatted = selectedDate.format('YYYY-MM-DD')

  return courses.filter(({ date }) => date === formatted)
}

const getEarliestDate = courses => {
  let dates = courses.map(({ date }) => date).sort()

  if (
    (moment().hour() >= 18 ||
      (moment().hour() >= 17 && moment().minute() >= 30)) &&
    moment(dates[0]).format('YYYY-MM-DD') ===
      moment()
        .add(1, 'day')
        .format('YYYY-MM-DD')
  ) {
    dates.shift()
  }

  return dates.length ? moment(dates[0], 'YYYY-MM-DD') : null
}

class BookingOptionsContainer extends React.Component {
  constructor(props) {
    super(props)
    const { selectedSupplier } = props
    const isFullLicence =
      selectedSupplier.courses[0].constant === 'FULL_LICENCE'

    this.state = {
      courseType: selectedSupplier.courses[0],
      schoolCourses: [],
      availableCourses: [],
      selectedCourse: null,
      selectedDate: null,
      selectedBikeHire: !isFullLicence ? 'no' : '',
      month: moment().startOf('month'),
      isLoading: true,
      isFullLicence,
      selectedLicenceType: null,
      selectedPackageDays: '',
      selectedPackageDates: [],
      submit: false,
      loadedMonths: {}
    }

    this.handleChangeCourseType = this.handleChangeCourseType.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleChangeCourse = this.handleChangeCourse.bind(this)
    this.handleChangeMonth = this.handleChangeMonth.bind(this)
    this.handleSelectBikeHire = this.handleSelectBikeHire.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onSelectPackageDays = this.onSelectPackageDays.bind(this)
    this.onSelectPackageDate = this.onSelectPackageDate.bind(this)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)

    window.sessionStorage.removeItem('widgetTrainings')

    window.document.body.scrollIntoView()
  }

  componentDidMount() {
    const { month, isFullLicence } = this.state
    if (isFullLicence) {
      this.setState({ isLoading: false })
      return
    }
    this.fetchCourses(month.clone())
  }

  componentDidUpdate(oldProps, oldState) {
    const { isFullLicence, month } = this.state
    if (isFullLicence) {
      return
    }

    if (oldProps.selectedSupplier !== this.props.selectedSupplier) {
      this.setState(
        {
          isLoading: true,
          availableCourses: [],
          schoolCourses: [],
          loadedMonths: {},
          selectedCourse: null,
          courseType: this.props.selectedSupplier.courses[0]
        },
        () => {
          this.fetchCourses(month.clone())
        }
      )
    }

    if (
      oldState.courseType.constant !== this.state.courseType.constant &&
      !this.state.availableCourses.length
    ) {
      this.setState({ isLoading: true })
      this.fetchCourses(month.clone())
    }
  }

  async fetchCourses(month) {
    const { selectedSupplier } = this.props
    const { loadedMonths } = this.state
    const courseType = this.state.courseType || selectedSupplier.courses[0]

    if (
      loadedMonths[courseType.constant] &&
      loadedMonths[courseType.constant].includes(month.format('YYYY-MM'))
    ) {
      this.setAvailableCourses([], courseType)
      return
    }

    this.setState({ isLoading: true })

    const schoolCourses = await fetchWidgetCourses(
      selectedSupplier.id,
      month.startOf('month').format('YYYY-MM-DD'),
      month.endOf('month').format('YYYY-MM-DD'),
      courseType.constant
    )

    this.setState({
      loadedMonths: {
        ...this.state.loadedMonths,
        [courseType.constant]: [
          ...(this.state.loadedMonths[courseType.constant] || []),
          month.format('YYYY-MM')
        ]
      }
    })
    this.setAvailableCourses(schoolCourses, courseType)
  }

  setAvailableCourses(schoolCourses, courseType) {
    const { schoolCourses: prevschoolCourses } = this.state
    const newSchoolCourses = [...prevschoolCourses, ...schoolCourses]
    const availableCourses = newSchoolCourses.filter(
      ({ course_type, training_count, spaces }) => {
        return course_type.id === courseType.id && training_count < spaces
      }
    )
    const selectedDate = getEarliestDate(availableCourses)
    const selectedCourses = getSchoolCoursesByDate(
      selectedDate,
      availableCourses
    )

    let selectedBikeHire = showOwnBikeHire(courseType) ? 'no' : 'auto'

    const isFullLicence = courseType.constant === 'FULL_LICENCE'

    if (isFullLicence) {
      selectedBikeHire = ''
    }

    this.setState({
      schoolCourses: newSchoolCourses,
      selectedDate,
      selectedCourse: selectedCourses[0],
      selectedBikeHire,
      availableCourses,
      courseType,
      isLoading: false,
      isFullLicence,
      selectedLicenceType: null,
      selectedPackageDays: '',
      selectedPackageDates: []
    })
  }

  handleChangeCourseType(courseTypeId) {
    const { selectedSupplier } = this.props
    const courseType = selectedSupplier.courses.filter(
      ({ id }) => id === parseInt(courseTypeId, 10)
    )[0]

    this.setState(
      {
        courseType
      },
      () => {
        this.fetchCourses(this.state.month.clone())
      }
    )
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
    this.setState({ month, isLoading: true }, () => {
      this.fetchCourses(this.state.month.clone())
    })
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

  handleSubmitClick() {
    const { selectedSupplier, slug } = this.props
    const {
      isFullLicence,
      selectedPackageDates,
      selectedLicenceType,
      selectedBikeHire,
      selectedCourse
    } = this.state

    let trainings = []

    if (isFullLicence) {
      trainings = selectedPackageDates.map(training => {
        return {
          school_course_id: training.course_id,
          course_type: training.type,
          full_licence_type: LICENCE_TYPES[selectedLicenceType],
          bike_type: selectedBikeHire,
          supplier_id: selectedSupplier.id,
          requested_date: training.date,
          requested_time: training.time
        }
      })
    } else {
      trainings = [
        {
          school_course_id: selectedCourse.id,
          course_type: selectedCourse.course_type.constant,
          bike_type: selectedBikeHire,
          supplier_id: selectedSupplier.id,
          requested_date: selectedCourse.date,
          requested_time: selectedCourse.time
        }
      ]
    }

    window.sessionStorage.setItem('widgetTrainings', JSON.stringify(trainings))

    this.setState({
      submit: `/widget/${slug}/payment/${
        isFullLicence ? 'FULL_LICENCE' : selectedCourse.id
      }?hire=${selectedBikeHire}`
    })
  }

  render() {
    const { widget, selectedSupplier, suppliers, onChangeSupplier } = this.props
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
      isFullLicence,
      submit
    } = this.state
    const selectedCourses = getSchoolCoursesByDate(
      selectedDate,
      availableCourses
    )

    if (submit) {
      return <Redirect push to={submit} />
    }

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
          labelField="town"
          selected={selectedSupplier.id}
          onChange={onChangeSupplier}
        />

        {!isFullLicence ? (
          <Calendar
            // optionsSelected={!!selectedSupplier && !!courseType}
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
            phoneNumber={selectedSupplier.phone}
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
          </React.Fragment>
        ) : null}

        {((isFullLicence && isAllPackageDatesSelected(selectedPackageDates)) ||
          (!isFullLicence && selectedCourse)) && (
          <button onClick={this.handleSubmitClick} className="WidgetBtn">
            Book Now
          </button>
        )}
      </div>
    )
  }
}

export default BookingOptionsContainer
