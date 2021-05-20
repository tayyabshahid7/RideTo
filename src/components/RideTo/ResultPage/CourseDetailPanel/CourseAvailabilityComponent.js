import React from 'react'
import moment from 'moment'
import classnames from 'classnames'
import styles from './styles.scss'
import AvailabilityCalendar from 'components/RideTo/AvailabilityCalendar'
import BikePicker from 'components/RideTo/ResultPage/CourseDetailPanel/BikePicker'
import Loading from 'components/Loading'
import {
  fetchPlatformCourses,
  fetchPlatformCourseTimes,
  fetchPlatformCourseBikes
} from 'services/course'

class CourseAvailabilityComponent extends React.Component {
  constructor(props) {
    super(props)

    let date = this.props.supplier.next_date_available
      ? new Date(this.props.supplier.next_date_available)
      : new Date()
    if (moment().isAfter(moment(date))) {
      date = moment().toDate()
    }
    if (this.props.date && moment(this.props.date).isAfter(moment(date))) {
      date = moment(this.props.date).toDate()
    }
    if (!this.props.supplier.instant_book) {
      if (this.props.supplier.excluded_dates.includes(this.props.supplier.next_date_available)) {
        this.props.onUpdate({ instantDate: null })  
      } else {
        this.props.onUpdate({ instantDate: this.props.supplier.next_date_available })
      }
    }

    this.state = {
      loadingTimes: false,
      initialDate: moment(date).format('YYYY-MM-DD'),
      calendar: {
        year: date.getFullYear(),
        month: date.getMonth()
      },
      courses: [],
      loadingCourses: false
    }

    this.bikePicker = React.createRef()
  }

  componentDidMount() {
    if (this.props.supplier.instant_book) {
      this.setState({ loadingCourses: true }, () => this.loadCourses())
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { supplier } = this.props
    if (!supplier.instant_book) {
      return
    }
    if (
      prevState.calendar.year !== this.state.calendar.year ||
      prevState.calendar.month !== this.state.calendar.month
    ) {
      this.setState({ loadingCourses: true }, () => this.loadCourses())
    }
  }

  async loadCourses() {
    const { year, month } = this.state.calendar
    const { supplier, courseType } = this.props
    let momentDate = moment(new Date(year, month, 1))

    const courses = await fetchPlatformCourses(
      supplier.id,
      momentDate.format('YYYY-MM-DD'),
      momentDate.endOf('month').format('YYYY-MM-DD'),
      courseType
    )
    this.setState({ courses, loadingCourses: false }, () => {
      this.handleDateSelect(this.state.initialDate, true)
    })
  }

  getFirstAndLastDate({ year, month }) {
    let oneDay = 1000 * 60 * 60 * 24
    let firstDay = new Date(year, month, 1)
    let dayOne = firstDay.getDay()
    if (dayOne === 0) {
      dayOne = 6
    } else {
      dayOne--
    }
    let firstDateInMonthCalendar = new Date(firstDay - dayOne * oneDay)
    return firstDateInMonthCalendar
  }

  generateDaysDataFromCalendar(courseLocation, calendar) {
    const { courses } = this.state
    let dates = []
    dates = this.generateCalendarDaysForMonth(calendar)
    let today = moment()
    let tomorrow = moment()
      .add(1, 'days')
      .hour(17)
      .minutes(30)

    if (courseLocation.instant_book) {
      tomorrow = moment()
        .add(1, 'days')
        .hour(23)
        .minutes(59)
        .seconds(59)
    }

    return dates.map(date => {
      let momentDate = moment(date)
      let dateInString = momentDate.format('YYYY-MM-DD')
      let disabled = false
      let invisible = date.getMonth() !== calendar.month
      let dayCourses = courses.filter(x => x.date === dateInString)
      if (
        courseLocation.excluded_days &&
        courseLocation.excluded_days.includes(momentDate.format('dddd'))
      ) {
        disabled = true
      }

      if (
        courseLocation.excluded_dates &&
        courseLocation.excluded_dates.includes(dateInString)
      ) {
        disabled = true
      }

      if (momentDate.isSameOrBefore(today)) {
        disabled = true
      } else if (
        moment(dateInString).isSame(tomorrow.format('YYYY-MM-DD')) &&
        (today.hour() > tomorrow.hour() ||
          (today.hour() === tomorrow.hour() &&
            today.minute() > tomorrow.minute()))
      ) {
        disabled = true
      }

      if (courseLocation.instant_book) {
        for (let i = dayCourses.length - 1; i >= 0; i--) {
          if (!dayCourses[i].spaces_available) {
            dayCourses.splice(i, 1)
          }
        }
        if (dayCourses.length === 0) {
          disabled = true
        }
      }

      return { date, disabled, invisible, courses: dayCourses }
    })
  }

  generateCalendarDaysForMonth({ year, month }) {
    let firstDate = this.getFirstAndLastDate({
      year,
      month
    })

    let dayLast = new Date(year, month + 1, 0)

    let days = []
    let diffDays = moment(dayLast).diff(moment(firstDate), 'days')
    let monthViewDays = diffDays < 35 ? 35 : 42
    for (let i = 0; i < monthViewDays; i++) {
      let date = new Date(firstDate)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }

  getNonInstantStartTimes(course) {
    return {
      bankHoliday: course.bank_holiday_start_time,
      weekend: course.weekend_start_time,
      weekday: course.weekday_start_time
    }
  }

  handlePrevMonth = () => {
    const { calendar } = this.state
    let month = calendar.month - 1
    let year = calendar.year
    if (month < 0) {
      month = 11
      year = year - 1
    }
    this.setState({ calendar: { ...calendar, month, year } })
  }

  handleNextMonth = () => {
    const { calendar } = this.state
    let month = calendar.month + 1
    let year = calendar.year
    if (month > 11) {
      month = 0
      year = year + 1
    }
    this.setState({ calendar: { ...calendar, month, year } })
  }

  handleDateSelect = async (instantDate, toValidate = false) => {
    const { calendar, courses } = this.state
    const { supplier, courseType, onUpdate, bike_hire } = this.props

    const dayCourses = courses.filter(x => x.date === instantDate)

    if (toValidate) {
      if (!dayCourses.length) {
        onUpdate({ instantDate: null })
        return
      }

      let isValid = false
      dayCourses.forEach(course => {
        if (course.spaces_available) {
          isValid = true
        }
      })
      if (!isValid) {
        onUpdate({ instantDate: null })
        return
      }
    }

    if (
      supplier.instant_book &&
      dayCourses.length &&
      !dayCourses[0].dataLoaded
    ) {
      this.setState({ loadingTimes: true })
      const times = await fetchPlatformCourseTimes(
        supplier.id,
        instantDate,
        instantDate,
        courseType
      )

      const bikes = await fetchPlatformCourseBikes(
        supplier.id,
        instantDate,
        instantDate,
        courseType
      )

      dayCourses.forEach(course => {
        const time = times.find(x => x.id === course.id)
        if (time) {
          Object.assign(course, time)
        }
        const bikeType = bikes.find(x => x.id === course.id)
        if (bikeType) {
          Object.assign(course, bikeType)
        }
        course.dataLoaded = true
      })
      this.setState({ courses, loadingTimes: false })
    }

    let instantCourse =
      this.props.instantDate === instantDate ? this.props.instantCourse : null
    this.setState({ calendar: { ...calendar } })
    onUpdate({ instantCourse, instantDate })

    if (!bike_hire && !this.props.fromSupplier) {
      setTimeout(() => {
        this.bikePicker.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        })
      }, 99)
    }
  }

  handleTimeSelect = async instantCourse => {
    const { onUpdate } = this.props
    onUpdate({ instantCourse })
  }

  handleChangeRawEvent(event) {
    const { onUpdate } = this.props
    onUpdate({ [event.target.name]: event.target.value })
  }

  render() {
    const {
      supplier,
      instantCourse,
      instantDate,
      bike_hire,
      onUpdate,
      courseType,
      fromSupplier
    } = this.props
    const { calendar, courses, loadingCourses, loadingTimes } = this.state
    let days = this.generateDaysDataFromCalendar(supplier, calendar)

    // determining course state for auto bikes
    const isAutoFull =
      instantCourse &&
      // !!instantCourse.auto_bikes &&
      instantCourse.auto_count >= instantCourse.auto_bikes
    const isAutoAvailable =
      !instantCourse ||
      (instantCourse &&
        !!instantCourse.auto_bikes &&
        instantCourse.auto_bikes > 0)

    // determining course state for auto 50cc bikes
    const isAuto50Full =
      instantCourse &&
      // !!instantCourse.auto_50cc_bikes &&
      instantCourse.auto_50cc_count >= instantCourse.auto_50cc_bikes
    const isAuto50Available =
      !instantCourse ||
      (instantCourse &&
        !!instantCourse.auto_50cc_bikes &&
        instantCourse.auto_50cc_bikes > 0)

    // determining course state for auto 125cc bikes
    const isAuto125Full =
      instantCourse &&
      // !!instantCourse.auto_125cc_bikes &&
      instantCourse.auto_125cc_count >= instantCourse.auto_125cc_bikes
    const isAuto125Available =
      !instantCourse ||
      (instantCourse &&
        !!instantCourse.auto_125cc_bikes &&
        instantCourse.auto_125cc_bikes > 0)

    // determining course state for manual 125cc bikes
    const isManualFull =
      instantCourse &&
      // !!instantCourse.manual_bikes &&
      instantCourse.manual_count >= instantCourse.manual_bikes
    const isManualAvailable =
      !instantCourse ||
      (instantCourse &&
        !!instantCourse.manual_bikes &&
        instantCourse.manual_bikes > 0)

    // determining course state for manual 50cc bikes
    const isManual50Full =
      instantCourse &&
      // !!instantCourse.manual_50cc_bikes &&
      instantCourse.manual_50cc_count >= instantCourse.manual_50cc_bikes
    const isManual50Available =
      !instantCourse ||
      (instantCourse &&
        !!instantCourse.manual_50cc_bikes &&
        instantCourse.manual_50cc_bikes > 0)

    const isOwnFull =
      instantCourse && instantCourse.own_bikes_count >= instantCourse.own_bikes
    const isItm = courseType === 'INTRO_TO_MOTORCYCLING'
    const isCbt = courseType === 'LICENCE_CBT'
    const isCbtRenewal = courseType === 'LICENCE_CBT_RENEWAL'
    const isInstantBook = !!supplier.instant_book

    return (
      <Loading loading={loadingCourses || loadingTimes}>
        <div className={classnames(styles.content, fromSupplier && 'px-0')}>
          <AvailabilityCalendar
            days={days}
            calendar={{
              ...calendar,
              selectedCourse: instantCourse,
              selectedDate: instantDate
            }}
            handleDateSelect={this.handleDateSelect}
            handleTimeSelect={this.handleTimeSelect}
            handlePrevMonth={this.handlePrevMonth}
            handleNextMonth={this.handleNextMonth}
            isInstantBook={!!supplier.instant_book}
            nonInstantPrices={supplier.week_prices}
            nonInstantStartTimes={this.getNonInstantStartTimes(supplier)}
            showChooseDate={true}
            courses={courses}
            disablePreviousDates
            course={supplier}
            courseType={courseType}
            checkFutureMonth
            loading={loadingCourses}
          />
          <BikePicker
            isCbt={isCbt}
            isItm={isItm}
            isCbtRenewal={isCbtRenewal}
            bike_hire={bike_hire}
            onUpdate={onUpdate}
            course={supplier}
            isOwnFull={isOwnFull}
            isAutoFull={isAutoFull}
            isAuto50Full={isAuto50Full}
            isAuto125Full={isAuto125Full}
            isManualFull={isManualFull}
            isManual50Full={isManual50Full}
            isAutoAvailable={isAutoAvailable}
            isAuto50Available={isAuto50Available}
            isAuto125Available={isAuto125Available}
            isManualAvailable={isManualAvailable}
            isManual50Available={isManual50Available}
            has_auto_bikes={supplier.has_auto_bikes}
            has_auto_bikes_50cc={isInstantBook && supplier.has_auto_bikes_50cc}
            has_auto_bikes_125cc={
              isInstantBook && supplier.has_auto_bikes_125cc
            }
            has_manual_bikes={supplier.has_manual_bikes}
            has_manual_50cc={isInstantBook && supplier.has_manual_50cc}
            isInstantBook={isInstantBook}
            ref={this.bikePicker}
          />
        </div>
      </Loading>
    )
  }
}

export default CourseAvailabilityComponent
