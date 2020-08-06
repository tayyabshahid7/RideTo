import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import CalendarMonthView from './CalendarMonthView'
import CalendarShiftView from './CalendarShiftView'
import styles from './index.scss'
import { CALENDAR_VIEW } from '../../common/constants'
import CalendarWeekView from './CalendarWeekView'
import Loading from 'components/Loading'
import CalendarFilter from 'components/Calendar/CalendarFilter'
import CalendarDatePicker from './CalendarDatePicker'
import CalendarViewChanger from './CalendarViewChanger'
import CalendarArrowsSwitcher from './CalendarArrowsSwitcher'
import CalendarMobileBackButton from './CalendarMobileBackButton'
import { IconSideFilter } from '../../assets/icons/'
import { Desktop } from 'common/breakpoints'
import MediaQuery from 'react-responsive'
import _ from 'lodash'

class CalendarComponent extends Component {
  renderOverview() {
    const { calendar, filterOpen, toggleFilter } = this.props
    const { viewMode } = calendar
    const { handleCustomEvent, handleChangeDate } = this.props

    return (
      <div className={classnames(styles.overview)}>
        <div className={styles.filtersWrap}>
          <div className={styles.leftFilter}>
            <div
              onClick={() => toggleFilter(!filterOpen)}
              className={classnames('icon-button', filterOpen && 'active')}>
              <IconSideFilter />
            </div>
            <CalendarDatePicker
              calendar={calendar}
              handleChangeDate={handleChangeDate}
            />
          </div>
          <div className={classnames(styles.changeCalendarWrapper)}>
            <CalendarArrowsSwitcher handleCustomEvent={handleCustomEvent} />
            <Desktop>
              <CalendarViewChanger
                viewMode={viewMode}
                handleCustomEvent={handleCustomEvent}
              />
            </Desktop>
          </div>
          <Desktop>
            <CalendarMobileBackButton
              handleCustomEvent={handleCustomEvent}
              viewMode={viewMode}
              calendar={calendar}
            />
          </Desktop>
        </div>
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
      sideBarOpen,
      filterOpen,
      activeSchools,
      instructors,
      inactiveUsers,
      inactiveCourses,
      handleChangeDate,
      handleToggleUser,
      toggleFilter,
      handleToggleCourse,
      handleCustomEvent
    } = this.props

    const tmpUsers = instructors.filter(
      x => _.intersection(x.supplier, activeSchools).length
    )
    const users = tmpUsers.filter(x => !inactiveUsers.includes(x.id))
    if (!inactiveUsers.includes(-1)) {
      users.push({ id: -1 })
    }

    return (
      <div className={classnames(styles.container)}>
        {this.renderOverview()}
        <div className={classnames(styles.wrapper)}>
          {filterOpen && (
            <CalendarFilter
              users={instructors}
              inactiveUsers={inactiveUsers}
              toggleUser={handleToggleUser}
              inactiveCourses={inactiveCourses}
              toggleCourse={handleToggleCourse}
              calendar={calendar}
              handleCustomEvent={handleCustomEvent}
              hideFilter={() => toggleFilter(false)}
            />
          )}
          <MediaQuery minWidth={768}>
            {matches => {
              if (matches || !filterOpen) {
                return (
                  <div
                    className={classnames(
                      styles.calendarContent,
                      sideBarOpen && styles.contentSidebar
                    )}>
                    <Loading
                      loading={calendar.loading}
                      className={styles.calendarWrapper}>
                      {calendar.viewMode === CALENDAR_VIEW.MONTH && (
                        <CalendarMonthView
                          days={days}
                          calendar={calendar}
                          history={history}
                          users={users}
                          inactiveCourses={inactiveCourses}
                          handleMobileCellClick={handleMobileCellClick}
                          sideBarOpen={sideBarOpen}
                        />
                      )}
                      {(calendar.viewMode === CALENDAR_VIEW.WEEK ||
                        calendar.viewMode === CALENDAR_VIEW.DAY) && (
                        <CalendarWeekView
                          match={match}
                          days={days}
                          calendar={calendar}
                          history={history}
                          handleMobileCellClick={handleMobileCellClick}
                          settings={settings}
                          handleChangeDate={handleChangeDate}
                          sideBarOpen={sideBarOpen}
                          filterOpen={filterOpen}
                          users={users}
                          inactiveCourses={inactiveCourses}
                          loading={calendar.loading}
                        />
                      )}
                      {calendar.viewMode === CALENDAR_VIEW.SHIFT && (
                        <CalendarShiftView
                          days={days}
                          calendar={calendar}
                          history={history}
                          users={users}
                          inactiveUsers={inactiveUsers}
                          handleMobileCellClick={handleMobileCellClick}
                          sideBarOpen={sideBarOpen}
                        />
                      )}
                    </Loading>
                  </div>
                )
              } else {
                return null
              }
            }}
          </MediaQuery>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings.settings,
    activeSchools: state.auth.activeSchools
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarComponent)
