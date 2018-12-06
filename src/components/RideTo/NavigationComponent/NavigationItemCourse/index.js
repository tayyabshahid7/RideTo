import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './NavigationItemCourse.scss'
import Button from 'components/RideTo/Button'
import { COURSE_TYPES } from 'common/constants'

class NavigationItemCourse extends Component {
  constructor(props) {
    super(props)

    this.state = {
      courseType: this.props.courseType,
      editable: false,
      error: false
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleToggleEditable = this.handleToggleEditable.bind(this)
  }

  handleChange(event) {
    const newCourseType = event.target.value
    this.setState({ courseType: newCourseType })

    // if (newCourseType.length > 0) {
    //   this.setState({ courseType: newCourseType, error: false })
    // } else {
    //   this.setState({ courseType: newCourseType, error: true })
    // }
  }

  handleClick() {
    if (this.props.courseType !== this.state.courseType) {
      this.props.onCourseUpdate(this.state.courseType)
    } else {
      this.setState({ editable: false })
    }
  }

  handleToggleEditable() {
    const currentPage = window.location.pathname

    if (
      !this.state.editable &&
      !['/course-addons/', '/course-type-selection'].includes(currentPage)
    ) {
      this.setState({ editable: true })
    }
  }

  render() {
    const { title, fullWidth = false, className, subtitle } = this.props

    const { courseType, editable, error } = this.state

    return (
      <div
        className={classnames(
          className,
          styles.navigationItem,
          styles.clickable,
          fullWidth && styles.fullWidth
        )}
        onClick={this.handleToggleEditable}>
        <div className={styles.title}>{title}</div>
        <div
          className={classnames(styles.subtitle, editable && styles.editable)}>
          {editable ? (
            <React.Fragment>
              <select
                name="coruse_type"
                defaultValue={courseType}
                onChange={this.handleChange}
                className={classnames(error && styles.inputError)}
                required>
                {COURSE_TYPES.map((course_type, index) => (
                  <option key={index} value={course_type.value}>
                    {course_type.name}
                  </option>
                ))}
              </select>
              <Button
                className={styles.updateButton}
                onClick={this.handleClick}>
                Update
              </Button>
            </React.Fragment>
          ) : (
            subtitle
          )}
        </div>
      </div>
    )
  }
}

export default NavigationItemCourse
