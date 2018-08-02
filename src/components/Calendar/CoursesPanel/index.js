import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

import { getCoursesOnDay } from 'services/course'
import CoursesPanelItem from './CoursesPanelItem'
import { getDayCourses } from 'actions/day'
import styles from './CoursesPanel.scss'

class CoursesPanel extends React.Component {
  componentDidMount() {
    this.loadCourses()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.date !== this.props.match.params.date) {
      this.loadCourses()
    }
  }

  loadCourses() {
    // const { getDayCourses, match } = this.props
    // const {
    //   params: { date }
    // } = match
    // console.log('Courses Panel componentDidMount', date)
    // getDayCourses(date)
  }

  render() {
    const { days, match } = this.props
    const {
      params: { date }
    } = match
    const title = moment(date, 'YYYY-MM-DD').format('dddd Do MMMM YYYY')
    let courses = getCoursesOnDay(days, date)
    courses = courses.sort((a, b) => a.time > b.time)
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
  return {
    courses: state.day.courses,
    loading: state.day.loading
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDayCourses
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesPanel)
