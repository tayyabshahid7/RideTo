import React, { Component } from 'react'
import styles from './styles.scss'

class CalendarLabels extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const {
      instructors,
      getInstructors,
      schoolId,
      info,
      loadCourseTypes
    } = this.props

    if (!instructors || instructors.length === 0) {
      getInstructors(schoolId)
    }

    if (!info.courseTypes || info.courseTypes.length === 0) {
      loadCourseTypes({ schoolId: schoolId })
    }
  }

  render() {
    const { info, instructors } = this.props

    return (
      <div>
        <div className={styles.title}>Calendar Labels</div>
        <div>
          <b>Instructors</b>
        </div>
        <ul className={styles.labelList}>
          {instructors.map(({ first_name, last_name, id }) => (
            <li key={id}>
              <span>
                {first_name} {last_name}
              </span>{' '}
              <input type="color" />
            </li>
          ))}
        </ul>
        <div>
          <b>Course types</b>
        </div>
        <ul className={styles.labelList}>
          {info.courseTypes.map(({ name, id }) => (
            <li key={id}>
              <span>{name}</span> <input type="color" />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default CalendarLabels
