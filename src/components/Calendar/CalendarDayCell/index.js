import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import CalendarDayCellItem from 'components/Calendar/CalendarDayCellItem'
import CalendarShiftDayCellItem from 'components/Calendar/CalendarShiftDayCellItem'
import UserWithTooltip from '../UserWithTooltip'
import { getStarTimeForEventForDate } from 'utils/helper'
import { getShortCourseType } from 'services/course'
import styles from './index.scss'
import sortBy from 'lodash/sortBy'
import { SHIFT_TYPES } from '../../../common/constants'

const getDayItems = (day, dateStr, users) => {
  let { courses = [], events = [] } = day

  const items = courses
    .map(course => {
      return {
        ...course,
        course: true,
        name: getShortCourseType(course.course_type),
        time: course.time.substring(0, 5)
      }
    })
    .concat(
      events.map(event => {
        return {
          ...event,
          event: true,
          time: getStarTimeForEventForDate(event, dateStr)
        }
      })
    )
    .sort((a, b) => b.all_day - a.all_day)

  return sortBy(items, ['time'])
}

const getShiftUsers = (day, users) => {
  const { staff = [] } = day
  const shiftStaff = staff.filter(x => x.event_type === SHIFT_TYPES[0].id)
  const shiftUsers = users.filter(u =>
    shiftStaff.find(x => parseInt(x.instructor_id) === u.id)
  )
  return shiftUsers
}

const CalendarDayCell = ({
  day,
  calendar,
  index,
  history,
  handleMobileCellClick,
  lastRow,
  users
}) => {
  const inputEl = useRef(null)
  const [showPopup, setShowPopup] = useState(false)
  const [showItems, setShowItems] = useState(0)

  const dateStr = moment(day.date).format('YYYY-MM-DD')
  const items = getDayItems(day, dateStr, users)

  useEffect(() => {
    function calculateCount() {
      const height = inputEl.current.clientHeight
      let cnt = Math.floor((height - 29) / 32)
      if (items.length > cnt) {
        cnt--
      }
      setShowItems(cnt)
    }

    window.addEventListener('resize', calculateCount)

    calculateCount()

    return () => window.removeEventListener('resize', calculateCount)
  }, [items])

  const selectedDay = dateStr === calendar.selectedDate
  const more = items.length - showItems
  const isOtherMonthDate = day.date.getMonth() !== calendar.month
  const isAxisDate =
    calendar.year === day.date.getFullYear() &&
    calendar.month === day.date.getMonth() &&
    calendar.day === day.date.getDate()
  const now = new Date()
  const isToday =
    now.getFullYear() === day.date.getFullYear() &&
    now.getMonth() === day.date.getMonth() &&
    now.getDate() === day.date.getDate()
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const shiftUsers = getShiftUsers(day, users)

  const handleClick = () => {
    history.push(`/calendar/${dateStr}`)
    //   if (isMobile) {
    //   handleMobileCellClick(dateStr)
    // } else {
    //   history.push(`/calendar/${dateStr}`)
    // }
  }

  const handleMore = event => {
    event.preventDefault()
    event.stopPropagation()
    setShowPopup(true)
  }

  const handleClose = event => {
    event.preventDefault()
    event.stopPropagation()
    setShowPopup(false)
  }

  const dayText = moment(day.date).format(isMobile ? 'D' : 'ddd DD')

  return (
    <div
      className={classnames(
        styles.container,
        selectedDay && styles.selectedDay,
        isAxisDate && 'axis-date'
      )}
      ref={inputEl}
      onClick={handleClick}>
      <div className={styles.content}>
        <div className={styles.cellHeader}>
          <div
            className={classnames(
              styles.date,
              isOtherMonthDate && styles.otherMonthDate,
              isToday && styles.highlight
            )}>
            {dayText}
          </div>
          {!isMobile && (
            <div className={styles.shiftUsers}>
              {shiftUsers.map(user => (
                <UserWithTooltip
                  user={user}
                  key={user.id}
                  right={index % 7 === 6}
                />
              ))}
            </div>
          )}
        </div>
        <div className={styles.courseContainer}>
          {items
            .slice(0, showItems)
            .map(item =>
              item.event_type ? (
                <CalendarShiftDayCellItem normal key={item.id} item={item} />
              ) : (
                <CalendarDayCellItem key={item.id} item={item} />
              )
            )}

          {more > 0 && (
            <div onClick={handleMore} className={styles.more}>
              + {more} More
            </div>
          )}
        </div>
        {showPopup && (
          <React.Fragment>
            <div onClick={handleClose} className={styles.popupBackdrop}></div>

            <div
              className={classnames(
                styles.detailPopup,
                lastRow && styles.detailLastRow
              )}>
              <div className={styles.cellHeader}>
                <div
                  className={classnames(
                    styles.date,
                    isOtherMonthDate && styles.otherMonthDate,
                    isToday && styles.highlight
                  )}>
                  {dayText}
                </div>
                <div className={styles.shiftUsers}>
                  {shiftUsers.map(user => (
                    <UserWithTooltip user={user} key={user.id} />
                  ))}
                </div>
              </div>
              {items.map(item =>
                item.event_type ? (
                  <CalendarShiftDayCellItem normal key={item.id} item={item} />
                ) : (
                  <CalendarDayCellItem key={item.id} item={item} />
                )
              )}
              <div className={styles.closeButton} onClick={handleClose}>
                <i className="fa fa-angle-up"></i>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default CalendarDayCell
