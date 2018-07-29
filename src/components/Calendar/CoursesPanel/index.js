import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

import { getCoursesOnDay } from 'services/course'
import CoursesPanelItem from './CoursesPanelItem'

import styles from './CoursesPanel.scss'

class CoursesPanel extends React.Component {
  render() {
    const { days, match } = this.props
    const {
      params: { date }
    } = match
    const title = moment(date, 'YYYY-MM-DD').format('dddd Do MMMM YYYY')
    const courses = getCoursesOnDay(days, date)

    return (
      <div className={styles.coursesPanel}>
        <h3>{title}</h3>

        <div className={styles.courses}>
          {courses.map(course => (
            <CoursesPanelItem key={course.time} date={date} course={course} />
          ))}
        </div>
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
)(CoursesPanel)
