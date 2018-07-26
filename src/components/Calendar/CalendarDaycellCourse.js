import React from 'react'
import s from '../../utils/helper'

const CalendarDayCellCourse = ({ course }) => (
  <div className="course">
    <div className="course-desc">
      {course.type} | {course.time}
    </div>
    <div
      className={`course-space ${course.available_spaces === 0 ? 'full' : ''}`}>
      {course.available_spaces === 0
        ? 'FULL'
        : `${course.available_spaces} space${s(
            course.available_spaces
          )} available`}
    </div>
  </div>
)

export default CalendarDayCellCourse
