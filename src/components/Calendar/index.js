import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Row, Col } from 'reactstrap'
import CalendarMonthView from './CalendarMonthView'
import styles from './index.scss'
import { CALENDAR_VIEW } from '../../common/constants'
import CalendarWeekView from './CalendarWeekView'
import Loading from 'components/Loading'
import SchoolSelect from 'components/SchoolSelect'
import CalendarDatePicker from './CalendarDatePicker'
import CalendarViewChanger from './CalendarViewChanger'
import CalendarArrowsSwitcher from './CalendarArrowsSwitcher'
import CalendarMobileBackButton from './CalendarMobileBackButton'
import { Desktop } from 'common/breakpoints'
import MediaQuery from 'react-responsive'

class CalendarComponent extends Component {
  renderOverview() {
    const { calendar, sideBarOpen } = this.props
    const { viewMode } = calendar
    const { handleCustomEvent, handleChangeDate } = this.props
    return (
      <div
        className={classnames(
          styles.overview,
          sideBarOpen && styles.sideBarOpen
        )}>
        <Row>
          <Col>
            <div className={styles.filtersWrap}>
              <MediaQuery minWidth={768}>
                <SchoolSelect />
                <Desktop>
                  <CalendarDatePicker
                    calendar={calendar}
                    handleChangeDate={handleChangeDate}
                  />
                </Desktop>
              </MediaQuery>
              <div
                className={classnames(
                  styles.changeCalendarWrapper,
                  viewMode === CALENDAR_VIEW.MONTH &&
                    styles.changeCalendarWrapperMonth
                )}>
                <CalendarArrowsSwitcher
                  handleCustomEvent={handleCustomEvent}
                  calendar={calendar}
                  handleChangeDate={handleChangeDate}
                />

                <CalendarViewChanger
                  viewMode={viewMode}
                  handleCustomEvent={handleCustomEvent}
                />
              </div>
              <CalendarMobileBackButton
                handleCustomEvent={handleCustomEvent}
                viewMode={viewMode}
                calendar={calendar}
              />
            </div>
          </Col>
        </Row>
      </div>
    )
  }
  render() {
    let {
      days,
      calendar,
      history,
      match,
      handleMobileCellClick,
      settings,
      sideBarOpen
    } = this.props

    return (
      <div className={classnames(styles.container)}>
        {this.renderOverview()}

        <Loading loading={calendar.loading} className={styles.calendarWrapper}>
          {calendar.viewMode === CALENDAR_VIEW.WEEK ? (
            <CalendarWeekView
              match={match}
              days={days}
              calendar={calendar}
              history={history}
              handleMobileCellClick={handleMobileCellClick}
              settings={settings}
              sideBarOpen={sideBarOpen}
              loading={calendar.loading}
            />
          ) : (
            <CalendarMonthView
              days={days}
              calendar={calendar}
              history={history}
              handleMobileCellClick={handleMobileCellClick}
              sideBarOpen={sideBarOpen}
            />
          )}
        </Loading>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings.settings
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarComponent)
