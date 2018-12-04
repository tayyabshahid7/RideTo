import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Row, Col, Button } from 'reactstrap'
import CalendarMonthView from './CalendarMonthView'
import CalendarHeader from './CalendarHeader'
import styles from './index.scss'
import { CALENDAR_VIEW } from '../../common/constants'
import CalendarWeekView from './CalendarWeekView'
import Loading from 'components/Loading'
import SchoolSelect from 'components/SchoolSelect'

class CalendarComponent extends Component {
  renderOverview() {
    const { viewMode } = this.props.calendar
    const { handleCustomEvent } = this.props
    return (
      <div className={classnames(styles.overview)}>
        <Row>
          <Col>
            <SchoolSelect className="Test" />
            <div className={styles.changeCalendarWrapper}>
              <span
                className={
                  viewMode === CALENDAR_VIEW.MONTH
                    ? styles.calendarTypeActive
                    : styles.calendarTypeInactive
                }>
                <button
                  onClick={() =>
                    handleCustomEvent('change-calendar-setting', {
                      viewMode: CALENDAR_VIEW.WEEK
                    })
                  }>
                  View Week
                </button>
              </span>{' '}
              |
              <span
                className={
                  viewMode === CALENDAR_VIEW.WEEK
                    ? styles.calendarTypeActive
                    : styles.calendarTypeInactive
                }>
                <button
                  onClick={() =>
                    handleCustomEvent('change-calendar-setting', {
                      viewMode: CALENDAR_VIEW.MONTH
                    })
                  }>
                  {' '}
                  View Month
                </button>
              </span>
            </div>
          </Col>
          <Col className={styles.rightButtons}>
            <Link
              to={`/calendar/courses/create`}
              className={styles.addCourseBtn}>
              <Button color="primary">Add Course</Button>
            </Link>
          </Col>
        </Row>
      </div>
    )
  }
  render() {
    let { days, calendar, handleCustomEvent, history } = this.props
    return (
      <div className={classnames(styles.container)}>
        {this.renderOverview()}
        <CalendarHeader
          calendar={calendar}
          handleCustomEvent={handleCustomEvent}
        />
        <Loading loading={calendar.loading} className={styles.calendarWrapper}>
          {calendar.viewMode === CALENDAR_VIEW.WEEK ? (
            <CalendarWeekView
              days={days}
              calendar={calendar}
              history={history}
            />
          ) : (
            <CalendarMonthView
              days={days}
              calendar={calendar}
              history={history}
            />
          )}
        </Loading>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarComponent)
