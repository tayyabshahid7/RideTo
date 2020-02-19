import React from 'react'
import moment from 'moment'
import styles from './styles.scss'
import AvailabilityCalendar from 'components/RideTo/AvailabilityCalendar'
import BikePicker from 'components/RideTo/ResultPage/CourseDetailPanel/BikePicker'
import Loading from 'components/Loading'
import { fetchWidgetCourses } from 'services/course'

class CourseAvailabilityComponent extends React.Component {
  constructor(props) {
    super(props)
    let date = this.props.date ? new Date(this.props.date) : new Date()
    this.state = {
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
    if (this.props.course.instant_book) {
      this.setState({ loadingCourses: true }, () => this.loadCourses())
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { course } = this.props
    if (!course.instant_book) {
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
    const { course, courseType } = this.props
    let momentDate = moment(new Date(year, month, 1))

    const courses = await fetchWidgetCourses(
      course.id,
      momentDate.format('YYYY-MM-DD'),
      momentDate.endOf('month').format('YYYY-MM-DD'),
      courseType
    )
    this.setState({ courses, loadingCourses: false })
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
      let dayCourses = courses.filter(
        courseLocation => courseLocation.date === dateInString
      )
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
          if (dayCourses[i].training_count >= dayCourses[i].spaces) {
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

  handlePrevMonth() {
    const { calendar } = this.state
    let month = calendar.month - 1
    let year = calendar.year
    if (month < 0) {
      month = 11
      year = year - 1
    }
    this.setState({ calendar: { ...calendar, month, year } })
  }

  handleNextMonth() {
    const { calendar } = this.state
    let month = calendar.month + 1
    let year = calendar.year
    if (month > 11) {
      month = 0
      year = year + 1
    }
    this.setState({ calendar: { ...calendar, month, year } })
  }

  handleDateSelect(instantDate) {
    const { calendar } = this.state
    const { onUpdate, bike_hire } = this.props
    let instantCourse =
      this.props.instantDate === instantDate ? this.props.instantCourse : null
    this.setState({ calendar: { ...calendar } })
    onUpdate({ instantCourse, instantDate })

    if (!bike_hire) {
      setTimeout(() => {
        this.bikePicker.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        })
      }, 99)
    }
  }

  handleTimeSelect(instantCourse) {
    const { onUpdate } = this.props
    onUpdate({ instantCourse })
  }

  handleChangeRawEvent(event) {
    const { onUpdate } = this.props
    onUpdate({ [event.target.name]: event.target.value })
  }

  render() {
    const {
      course,
      instantCourse,
      instantDate,
      bike_hire,
      onUpdate,
      courseType
    } = this.props
    const { calendar, courses, loadingCourses } = this.state
    let days = this.generateDaysDataFromCalendar(course, calendar)

    // determining course state for auto 50cc bikes
    const isAutoFull =
      instantCourse &&
      !!instantCourse.auto_bikes &&
      instantCourse.auto_count >= instantCourse.auto_bikes
    const isAutoAvailable =
      instantCourse &&
      !!instantCourse.auto_bikes &&
      instantCourse.auto_bikes > 0

    // determining course state for auto 50cc bikes
    const isAuto125Full =
      instantCourse &&
      !!instantCourse.auto_125cc_bikes &&
      instantCourse.auto_125cc_count >= instantCourse.auto_125cc_bikes
    const isAuto125Available =
      instantCourse &&
      !!instantCourse.auto_125cc_bikes &&
      instantCourse.auto_125cc_bikes > 0

    // determining course state for auto 50cc bikes
    const isManualFull =
      instantCourse &&
      !!instantCourse.manual_bikes &&
      instantCourse.manual_count >= instantCourse.manual_bikes
    const isManualAvailable =
      instantCourse &&
      !!instantCourse.manual_bikes &&
      instantCourse.manual_bikes > 0

    // determining course state for auto 50cc bikes
    const isManual50Full =
      instantCourse &&
      !!instantCourse.manual_50cc_bikes &&
      instantCourse.manual_50cc_count >= instantCourse.manual_50cc_bikes
    const isManual50Available =
      instantCourse &&
      !!instantCourse.manual_50cc_bikes &&
      instantCourse.manual_50cc_bikes > 0

    const isItm = courseType === 'INTRO_TO_MOTORCYCLING'
    const isCbt = courseType === 'LICENCE_CBT'
    const isCbtRenewal = courseType === 'LICENCE_CBT_RENEWAL'
    const isInstantBook = !!course.instant_book
    return (
      <Loading loading={loadingCourses}>
        <div className={styles.content}>
          <AvailabilityCalendar
            days={days}
            calendar={{
              ...calendar,
              selectedCourse: instantCourse,
              selectedDate: instantDate
            }}
            handleDateSelect={this.handleDateSelect.bind(this)}
            handlePrevMonth={this.handlePrevMonth.bind(this)}
            handleNextMonth={this.handleNextMonth.bind(this)}
            handleTimeSelect={this.handleTimeSelect.bind(this)}
            isInstantBook={isInstantBook}
            nonInstantPrices={course.week_prices}
            nonInstantStartTimes={this.getNonInstantStartTimes(course)}
            showChooseDate={true}
            courses={courses}
            disablePreviousDates
            course={course}
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
            course={course}
            isAutoFull={isAutoFull}
            isManualFull={isManualFull}
            isAuto125Full={isAuto125Full}
            isManual50Full={isManual50Full}
            isAutoAvailable={isAutoAvailable}
            isAuto125Available={isAuto125Available}
            isManualAvailable={isManualAvailable}
            isManual50Available={isManual50Available}
            has_auto_bikes={course.has_auto_bikes}
            has_manual_bikes={course.has_manual_bikes}
            has_auto_bikes_125cc={isInstantBook && course.has_auto_bikes_125cc}
            has_manual_50cc={isInstantBook && course.has_manual_50cc}
            ref={this.bikePicker}
            isInstantBook={isInstantBook}
          />
        </div>
      </Loading>
    )
  }
}

export default CourseAvailabilityComponent
