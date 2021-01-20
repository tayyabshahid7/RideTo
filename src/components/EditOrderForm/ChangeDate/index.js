import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import styles from './styles.scss'
import { Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { ConnectInput, ConnectSelect, Button } from 'components/ConnectForm'
import LoadingMask from 'components/LoadingMask'
import { DATE_FORMAT } from 'common/constants'
import { getCourses } from 'store/course'

class ChangeDate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      date: this.props.date,
      time: this.props.time,
      showTimes: true,
      isDateChanged: false,
      isTimeChanged: false,
      availableDate: []
    }

    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleTimeChange = this.handleTimeChange.bind(this)
    this.handleFetchTimes = this.handleFetchTimes.bind(this)
    this.handleUpdateClick = this.handleUpdateClick.bind(this)
  }

  getFirstAndLastDate(year, month) {
    let oneDay = 1000 * 60 * 60 * 24
    let firstDay = new Date(year, month, 1)
    let dayOne = firstDay.getDay()
    if (dayOne === 0) {
      dayOne = 6
    } else {
      dayOne--
    }
    let dayLast = new Date(year, month + 1, 0)
    let firstDateInMonthCalendar = new Date(firstDay - dayOne * oneDay)
    let monthViewDays = dayOne + dayLast.getDate() <= 35 ? 35 : 42
    let date = new Date(firstDateInMonthCalendar)
    date.setDate(date.getDate() + monthViewDays - 1)
    return { firstDate: firstDateInMonthCalendar, lastDate: date }
  }

  componentDidMount() {
    this.handleCalendarChange(this.props.date)
    this.handleFetchTimes({ init: true })
  }

  handleCalendarChange = date => {
    const { course, calendar, getCourses } = this.props
    const schoolId = course.supplier
    const { firstDate, lastDate } = this.getFirstAndLastDate(
      moment(date).year(),
      moment(date).month()
    )
    const formatedFirstDate = moment(firstDate).format(DATE_FORMAT)
    const formatedLastDate = moment(lastDate).format(DATE_FORMAT)
    const month = `${formatedFirstDate}-${formatedLastDate}-${schoolId}`

    if (
      Array.isArray(calendar.loadedMonths) &&
      calendar.loadedMonths.includes(month)
    ) {
      return
    }

    getCourses({
      schoolId,
      firstDate: formatedFirstDate,
      lastDate: formatedLastDate,
      month
    })
  }

  handleDateChange(event) {
    this.setState(
      {
        date: event.target.value,
        time: '',
        showTimes: false,
        isDateChanged: true,
        isTimeChanged: true
      },
      () => {
        this.handleFetchTimes({ init: false })
      }
    )
  }

  async handleFetchTimes({ init }) {
    const { loadTimes, time } = this.props
    const { date } = this.state

    if (init || this.props.date === date) {
      await loadTimes(date, time)
    } else {
      await loadTimes(date)
    }

    this.setState({
      showTimes: true
    })

    if (!init) {
      this.setState({
        time: this.props.times.length ? this.props.times[0].time : null
      })
    }
  }

  handleTimeChange(value) {
    this.setState({
      time: value,
      isTimeChanged: true
    })
  }

  handleUpdateClick() {
    const { onSave, times } = this.props
    const { date, time } = this.state
    const training_date_time = `${date}T${time}Z`
    const { course_id } = times.find(t => t.time === time)
    onSave({ training_date_time, school_course: course_id }, true)
  }

  render() {
    const { times, disabled, calendar } = this.props
    const { date, time, showTimes, isTimeChanged } = this.state

    // calculate available dates
    const { calendarCourses, courseType, course } = this.props
    const availableDate = !course
      ? []
      : calendarCourses
          .filter(
            x =>
              x.course_type.constant === courseType &&
              x.spaces_available > 0 &&
              x.supplier === course.supplier
          )
          .map(({ date }) => new Date(date))

    return (
      <div className={styles.form}>
        <Row>
          <Col>
            <div className={styles.addon}>
              <ConnectInput
                basic
                label="Course Date"
                name="date"
                value={date}
                type="date"
                onChange={this.handleDateChange}
                onCalendarChange={this.handleCalendarChange}
                className={styles.dateInput}
                highlightDates={availableDate}
                disabled={disabled}
              />
              {calendar.loading && <LoadingMask loading={true} />}
              {/*
              <Button
                disabled={!isDateChanged}
                small
                type="button"
                color="primary"
                onClick={this.handleFetchTimes}>
                Update
              </Button>
              */}
            </div>
          </Col>
        </Row>
        {showTimes && (
          <Row>
            <Col>
              {!times.length ? (
                <span className={styles.noTimes}>
                  No times available on this date
                </span>
              ) : (
                <ConnectSelect
                  basic
                  name="time"
                  selected={time}
                  label="Time"
                  options={
                    !showTimes
                      ? []
                      : times.map(time => ({
                          title: time.time,
                          value: time.time,
                          key: `${time.course_id}-${time.time}`
                        }))
                  }
                  valueField="value"
                  labelField="title"
                  noSelectOption
                  onChange={this.handleTimeChange}
                  disabled={!showTimes || !times.length || disabled}
                />
              )}
            </Col>
          </Row>
        )}
        {date && time && isTimeChanged && (
          <Row>
            <Col className="mb-3">
              <Button
                small
                type="button"
                color="primary"
                onClick={this.handleUpdateClick}>
                Update time
              </Button>
            </Col>
          </Row>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    calendarCourses: state.course.calendar.courses,
    calendar: state.course.calendar
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getCourses
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeDate)
