import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Row, Col } from 'reactstrap'
import CalendarMonthView from './CalendarMonthView'
import CalendarHeader from './CalendarHeader'
import styles from './index.scss'
import { CALENDAR_VIEW } from '../../common/constants'
import CalendarWeekView from './CalendarWeekView'
import Loading from 'components/Loading'
import SchoolSelect from 'components/SchoolSelect'
import CalendarDateChanger from './CalendarDateChanger'
import CalendarViewChanger from './CalendarViewChanger'

class CalendarComponent extends Component {
  renderOverview() {
    const { calendar } = this.props
    const { viewMode } = calendar
    const { handleCustomEvent, handleChangeDate } = this.props
    return (
      <div className={classnames(styles.overview)}>
        <Row>
          <Col>
            <div className={styles.filtersWrap}>
              <SchoolSelect className="Test" />
              <div className={styles.changeCalendarWrapper}>
                {viewMode === CALENDAR_VIEW.MONTH && (
                  <CalendarDateChanger
                    calendar={calendar}
                    handleChangeDate={handleChangeDate}
                  />
                )}
                <CalendarViewChanger
                  viewMode={viewMode}
                  handleCustomEvent={handleCustomEvent}
                />
              </div>
            </div>
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

        {calendar.viewMode === CALENDAR_VIEW.WEEK && (
          <CalendarHeader
            calendar={calendar}
            handleCustomEvent={handleCustomEvent}
          />
        )}

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
