import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import { Redirect } from 'react-router-dom'

import CourseAvailabilityComponentFullLicence from 'components/RideTo/ResultPage/CourseDetailPanel/CourseAvailabilityComponentFullLicence.js'
import Calendar from 'pages/Widget/components/Calendar'
import MotorbikeOptions from 'pages/Widget/components/MotorbikeOptions'
import CourseSelect from 'pages/Widget/components/CourseSelect'
import BookingOption from 'pages/Widget/components/BookingOption'
import { fetchWidgetCourses, getCourseTypes } from 'services/course'
import {
  showOwnBikeHire,
  getTotalOrderPrice,
  asPoundSterling,
  getEarliestDate,
  getValidCourses
} from 'services/widget'
import { LICENCE_TYPES } from 'common/constants'
import ButtonArrowWhite from '../../../assets/images/rideto/ButtonArrowWhite.svg'
import ArrowLeft from '../../../assets/images/rideto/ArrowLeft.svg'
import styles from './BookingOptionsContainer.scss'

import classnames from 'classnames'

const getSchoolCoursesByDate = (selectedDate, courses) => {
  if (!selectedDate) {
    return []
  }
  const formatted = selectedDate.format('YYYY-MM-DD')

  return getValidCourses(courses).filter(({ date }) => date === formatted)
}

class BookingOptionsContainer extends React.Component {
  constructor(props) {
    super(props)
    const { selectedSupplier } = props
    const isFullLicence =
      selectedSupplier.courses[0].constant === 'FULL_LICENCE'

    this.state = {
      courseType: this.getDefaultCourse(),
      schoolCourses: [],
      availableCourses: [],
      selectedCourse: null,
      selectedDate: null,
      selectedBikeHire: !isFullLicence ? 'no' : '',
      month: moment().startOf('month'),
      isLoading: true,
      isFullLicence,
      selectedLicenceType: null,
      selectedPackageHours: '',
      submit: false,
      loadedMonths: {},
      showDayOfWeekPicker: false,
      selectedTimeDays: [],
      courseTypes: [],
      formCompletedWithoutTheory: false,
      loadingCourseTypes: true
    }

    this.handleChangeCourseType = this.handleChangeCourseType.bind(this)
    this.handleChangeDate = this.handleChangeDate.bind(this)
    this.handleChangeCourse = this.handleChangeCourse.bind(this)
    this.handleChangeMonth = this.handleChangeMonth.bind(this)
    this.handleSelectBikeHire = this.handleSelectBikeHire.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onSelectPackageHours = this.onSelectPackageHours.bind(this)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
    this.timeDayChange = this.timeDayChange.bind(this)
    this.handleBackClick = this.handleBackClick.bind(this)

    window.sessionStorage.removeItem('widgetTrainings')

    window.document.body.scrollIntoView()
  }

  componentDidMount() {
    const { month } = this.state
    this.fetchCourses(month.clone())
    this.fetchCourseTypes()
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldProps.selectedSupplier !== this.props.selectedSupplier) {
      this.setState(
        {
          // month: moment().startOf('month'),
          selectedDate: null,
          isLoading: true,
          availableCourses: [],
          schoolCourses: [],
          loadedMonths: {},
          selectedCourse: null,
          courseType:
            this.props.selectedSupplier.courses.find(
              courseType =>
                courseType.constant === this.state.courseType.constant
            ) || this.getDefaultCourse(),
          isFullLicence:
            this.props.selectedSupplier.courses[0].constant === 'FULL_LICENCE'
        },
        () => {
          this.fetchCourses(this.state.month.clone())
        }
      )
    }
  }

  getDefaultCourse = () => {
    const {
      selectedSupplier: { courses }
    } = this.props
    const cbtCourse = courses.find(x => x.constant === 'LICENCE_CBT')
    if (cbtCourse) {
      return cbtCourse
    }
    return courses[0]
  }

  async fetchCourseTypes() {
    const { selectedSupplier } = this.props
    const courseTypes = await getCourseTypes(selectedSupplier.id)
    this.setState({ courseTypes, loadingCourseTypes: false })
  }

  async fetchCourses(month) {
    const { selectedSupplier } = this.props
    const { loadedMonths } = this.state
    const courseType = this.state.courseType || this.getDefaultCourse()

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

  getBikeHire(courseType, course) {
    let bikeType = showOwnBikeHire(courseType) ? 'no' : 'auto'

    if (
      bikeType === 'no' &&
      course &&
      course.own_bikes_count >= course.own_bikes
    ) {
      bikeType = 'auto'
    }

    if (
      bikeType === 'auto' &&
      course &&
      course.auto_count >= course.auto_bikes
    ) {
      bikeType = 'manual'
    }

    if (
      bikeType === 'manual' &&
      course &&
      course.manual_count >= course.manual_bikes
    ) {
      bikeType = ''
    }

    return bikeType
  }

  setAvailableCourses(schoolCourses, courseType) {
    const { selectedSupplier } = this.props
    const { schoolCourses: prevschoolCourses } = this.state
    const newSchoolCourses = _.uniqBy(
      [...prevschoolCourses, ...schoolCourses],
      'id'
    )
    const availableCourses = newSchoolCourses.filter(
      ({ course_type, training_count, spaces }) => {
        return course_type.id === courseType.id && training_count < spaces
      }
    )
    const isFullLicence = courseType.constant === 'FULL_LICENCE'

    const data = {
      schoolCourses: newSchoolCourses,
      availableCourses,
      courseType,
      isLoading: false,
      isFullLicence,
      selectedLicenceType: null,
      selectedPackageHours: '',
      selectedPackageDates: []
    }

    if (
      !this.state.selectedCourse ||
      this.state.selectedCourse.supplier !== selectedSupplier.id ||
      !this.state.courseType ||
      this.state.selectedCourse.course_type.constant !== courseType.constant
    ) {
      const selectedDate = getEarliestDate(availableCourses)
      const selectedCourses = getSchoolCoursesByDate(
        selectedDate,
        availableCourses
      )

      let selectedBikeHire = this.getBikeHire(courseType, selectedCourses[0])

      data.selectedDate = selectedDate
      data.selectedCourse = !isFullLicence
        ? selectedCourses[0]
        : availableCourses[0]
      data.selectedBikeHire = selectedBikeHire

    }

    if (isFullLicence) {
      data.selectedBikeHire = ''
    }

    this.setState(data)
  }

  handleChangeCourseType(courseTypeId) {
    const { selectedSupplier } = this.props
    const courseType = selectedSupplier.courses.find(
      course => course.id === parseInt(courseTypeId, 10)
    )

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

    let selectedBikeHire = this.getBikeHire(
      this.state.courseType,
      selectedCourses[0]
    )

    this.setState({
      selectedDate,
      selectedCourse: selectedCourses[0],
      selectedBikeHire: selectedBikeHire
    })
  }

  handleChangeCourse(selectedCourse) {
    let selectedBikeHire = this.getBikeHire(
      this.state.courseType,
      selectedCourse
    )

    this.setState({
      selectedCourse,
      selectedBikeHire
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
    const newState = { ...data }

    if (data.bike_hire) {
      newState.selectedBikeHire = data.bike_hire
    }

    this.setState(newState)
  }

  onSelectPackageHours(hours) {
    this.onUpdate({
      selectedPackageHours: hours
    })
  }

  timeDayChange({ time, day, status }) {
    const { selectedTimeDays } = this.state
    const dayTime = `${day}_${time}`

    if (status) {
      this.setState({
        selectedTimeDays: [...selectedTimeDays, dayTime]
      })
    } else {
      this.setState({
        selectedTimeDays: selectedTimeDays.filter(
          timeDay => timeDay !== dayTime
        )
      })
    }
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
      selectedBikeHire,
      selectedCourse,
      showDayOfWeekPicker,
      selectedTimeDays,
      selectedLicenceType,
      selectedPackageHours
    } = this.state

    if (!selectedBikeHire) {
      return
    }

    localStorage.setItem('RIDETO_WIDGTE_SCHOOL_URL', selectedCourse.school_url)

    let trainings = []

    if (isFullLicence && !showDayOfWeekPicker) {
      this.setState({
        showDayOfWeekPicker: true
      })
      return
    }

    if (isFullLicence) {
      trainings = selectedTimeDays.map(timeDay => ({
        selected_availability: timeDay,
        course_type: 'FULL_LICENCE',
        full_licence_type: LICENCE_TYPES[selectedLicenceType],
        bike_type: selectedBikeHire,
        supplier_id: selectedSupplier.id,
        package_hours: selectedPackageHours,
        school_course_id: selectedCourse.id
      }))
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

  handleBackClick() {
    this.setState({
      showDayOfWeekPicker: false,
      selectedTimeDays: [],
      formCompletedWithoutTheory: false
    })
  }

  render() {
    const { widget, selectedSupplier, suppliers, onChangeSupplier } = this.props
    const {
      courseType,
      courseTypes,
      loadingCourseTypes,
      availableCourses,
      selectedDate,
      selectedCourse,
      selectedBikeHire,
      selectedLicenceType,
      selectedPackageHours,
      isLoading,
      isFullLicence,
      submit,
      showDayOfWeekPicker,
      selectedTimeDays,
      formCompletedWithoutTheory
    } = this.state
    const selectedCourses = getSchoolCoursesByDate(
      selectedDate,
      availableCourses
    )

    const isFirstFullLicencePanelComplete =
      isFullLicence &&
      !showDayOfWeekPicker &&
      selectedBikeHire &&
      selectedLicenceType &&
      selectedPackageHours

    const isSecondFullLicencePanelComplete =
      isFullLicence &&
      showDayOfWeekPicker &&
      selectedBikeHire &&
      selectedLicenceType &&
      selectedPackageHours &&
      selectedTimeDays.length

    if (submit) {
      return <Redirect push to={submit} />
    }
    if (window.DEBUG) {
      console.log(this.state, this.props)
    }
    if (loadingCourseTypes) {
      return <div className={styles.bookingOptions}>Loading</div>
    }

    if (!courseType) {
      return <div className={styles.bookingOptions}>No Course Found</div>
    }
    const tmp = courseTypes.find(x => x.constant === courseType.constant)
    const bikeSetup = tmp
      ? tmp.bike_hire_setup.find(x => x.supplier.id === selectedSupplier.id)
      : null

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
          labelField="connect_location_name"
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
            initialVisibleMonth={() => moment().startOf('month')}
          />
        ) : (
          selectedCourse && (
            <CourseAvailabilityComponentFullLicence
              isWidget
              course={{
                ...selectedSupplier,
                price: selectedCourse.pricing
                  ? selectedCourse.pricing.price
                  : null
              }}
              bike_hire={selectedBikeHire}
              onUpdate={this.onUpdate}
              onSelectPackage={this.onSelectPackageHours}
              onSelectPackageDate={this.onSelectPackageDate}
              selectedLicenceType={selectedLicenceType}
              selectedPackageHours={selectedPackageHours}
              phoneNumber={selectedSupplier.phone}
              showDayOfWeekPicker={showDayOfWeekPicker}
              selectedTimeDays={selectedTimeDays}
              timeDayChange={this.timeDayChange}
            />
          )
        )}

        <hr />

        {selectedCourse && !isFullLicence ? (
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
              bikeSetup={bikeSetup}
            />

            <hr />

            <div className={styles.totalPrice}>
              Total Price: {this.getTotalPrice()}
            </div>

            <hr />
          </React.Fragment>
        ) : null}

        <div className={showDayOfWeekPicker ? styles.hasBackButton : undefined}>
          {showDayOfWeekPicker && (
            <button
              onClick={this.handleBackClick}
              className="backButton"
              title="Back">
              <img src={ArrowLeft} alt="Back" />
            </button>
          )}
          {(isFirstFullLicencePanelComplete && !formCompletedWithoutTheory) ||
          isSecondFullLicencePanelComplete ||
          (!isFullLicence && selectedCourse) ? (
            <button
              onClick={this.handleSubmitClick}
              className="WidgetBtn"
              disabled={!selectedBikeHire}>
              {isFullLicence ? (
                <React.Fragment>
                  <span>Continue</span>
                  <img
                    style={{ marginLeft: '5px', verticalAlign: 'middle' }}
                    src={ButtonArrowWhite}
                    alt="arrow"
                  />
                </React.Fragment>
              ) : (
                'Book Now'
              )}
            </button>
          ) : (
            isFullLicence && (
              <button
                onClick={this.handleSubmitClick}
                className={classnames('WidgetBtn', styles.WidgetBtnDisabled)}
                disabled>
                {isFullLicence ? (
                  <React.Fragment>
                    <span>Continue</span>
                    <img
                      style={{ marginLeft: '5px', verticalAlign: 'middle' }}
                      src={ButtonArrowWhite}
                      alt="arrow"
                    />
                  </React.Fragment>
                ) : (
                  'Book Now'
                )}
              </button>
            )
          )}
        </div>
      </div>
    )
  }
}

export default BookingOptionsContainer
