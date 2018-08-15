import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CalendarMonthView from './CalendarMonthView'
import CalendarHeader from './CalendarHeader'
import styles from './index.scss'
import { CALENDAR_VIEW } from '../../common/constants'
import CalendarWeekView from './CalendarWeekView'
import Loading from 'components/Loading'

class CalendarComponent extends Component {
  renderOverview() {
    const { viewMode } = this.props.calendar
    const { handleCustomEvent } = this.props
    return (
      <div className={styles.overview}>
        <div>Calendar View</div>
        <div>
          <span
            className={
              viewMode === CALENDAR_VIEW.MONTH
                ? styles.calendarTypeActive
                : styles.calendarTypeInactive
            }>
            <a
              onClick={() =>
                handleCustomEvent('change-calendar-setting', {
                  viewMode: CALENDAR_VIEW.WEEK
                })
              }>
              View Week
            </a>
          </span>{' '}
          |
          <span
            className={
              viewMode === CALENDAR_VIEW.WEEK
                ? styles.calendarTypeActive
                : styles.calendarTypeInactive
            }>
            <a
              onClick={() =>
                handleCustomEvent('change-calendar-setting', {
                  viewMode: CALENDAR_VIEW.MONTH
                })
              }>
              {' '}
              View Month
            </a>
          </span>
        </div>
      </div>
    )
  }
  render() {
    let { days, calendar, handleCustomEvent, history } = this.props
    return (
      <div className={styles.container}>
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
