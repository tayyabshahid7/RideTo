import React, { Component } from 'react'
import styles from './styles.scss'
import { Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { ConnectInput, ConnectSelect, Button } from 'components/ConnectForm'

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
    this.filterDates = this.filterDates.bind(this)
  }

  filterDates() {
    const { calendarCourses, courseType } = this.props
    const availableDate = calendarCourses
      .filter(course => courseType === course.course_type.constant)
      .filter(course => course.spaces > course.orders.length)
      .map(({ date }) => new Date(date))

    this.setState({
      availableDate
    })
  }

  componentDidMount() {
    this.filterDates()
    this.handleFetchTimes({ init: true })
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
    const { times } = this.props
    const { date, time, showTimes, isTimeChanged, availableDate } = this.state

    return (
      <div className={styles.form}>
        <Row>
          <Col sm="10">
            <div className={styles.addon}>
              <ConnectInput
                basic
                label="Course date"
                name="date"
                value={date}
                type="date"
                onChange={this.handleDateChange}
                className={styles.dateInput}
                highlightDates={availableDate}
              />
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
            <Col sm="10">
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
                  disabled={!showTimes || !times.length}
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
    calendarCourses: state.course.calendar.courses
  }
}

export default connect(mapStateToProps)(ChangeDate)
