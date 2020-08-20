import React, { Component } from 'react'
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
  getActiveUsers = () => {
    const { instructors, activeSchools, inactiveUsers } = this.props

    const currUsers = instructors.filter(
      x => _.intersection(x.supplier, activeSchools).length
    )
    const activeUsers = currUsers.filter(x => !inactiveUsers.includes(x.id))
    if (!inactiveUsers.includes(-1)) {
      activeUsers.push({ id: -1 })
    }
    return activeUsers
  }

  handleToggleFitler = e => {
    e.stopPropagation()
    e.preventDefault()

    const { filterOpen, toggleFilter } = this.props
    toggleFilter(!filterOpen)
  }

  renderOverview() {
    const { calendar, filterOpen } = this.props
    const { viewMode } = calendar
    const { handleCustomEvent, handleChangeDate } = this.props

    return (
      <div className={classnames(styles.overview)}>
        <div className={styles.filtersWrap}>
          <div className={styles.leftFilter}>
            <div
              id="btn-filter-toggle"
              onClick={this.handleToggleFitler}
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
      instructors,
      inactiveUsers,
      inactiveCourses,
      handleChangeDate,
      handleToggleUser,
      toggleFilter,
      suppliers,
      handleToggleCourse,
      handleCustomEvent
    } = this.props

    const users = this.getActiveUsers()

    return (
      <div className={classnames(styles.container)}>
        {this.renderOverview()}
        <div className={classnames(styles.wrapper)}>
          <div
            className={classnames(
              styles.filterWrapper,
              filterOpen && styles.filterForm
            )}>
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
          </div>
          {filterOpen && (
            <div
              onClick={() => toggleFilter(false)}
              className={styles.filterBackdrop}></div>
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
                          suppliers={suppliers}
                          loading={calendar.loading}
                        />
                      )}
                      {calendar.viewMode === CALENDAR_VIEW.SHIFT && (
                        <CalendarShiftView
                          days={days}
                          calendar={calendar}
                          history={history}
                          users={instructors}
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

export default CalendarComponent
