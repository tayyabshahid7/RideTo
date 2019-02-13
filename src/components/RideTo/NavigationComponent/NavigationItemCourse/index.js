import React, { Component } from 'react'
import classnames from 'classnames'
import styles from './NavigationItemCourse.scss'
import { AVAILABLE_COURSE_TYPES } from 'common/constants'

class NavigationItemCourse extends Component {
  constructor(props) {
    super(props)

    this.state = {
      courseType: this.props.courseType,
      subtitle: this.props.subtitle,
      editable: false
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleToggleEditable = this.handleToggleEditable.bind(this)
  }

  handleClick(selectedCourseType) {
    if (selectedCourseType.constant !== this.state.courseType) {
      this.setState(
        {
          courseType: selectedCourseType.constant,
          subtitle: selectedCourseType.name,
          editable: false
        },
        () => this.props.onCourseUpdate(selectedCourseType.constant)
      )
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
    } else {
      this.setState({ editable: false })
    }
  }

  render() {
    const {
      title,
      fullWidth = false,
      className,
      courseTypesOptions
    } = this.props
    const { courseType, editable, subtitle } = this.state

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
            <div className={styles.courseTypeSelector}>
              <div
                onClick={this.handleToggleEditable}
                className={styles.closeButton}>
                Close
              </div>
              {courseTypesOptions.map(
                (course_type, index) =>
                  AVAILABLE_COURSE_TYPES.includes(course_type.constant) && (
                    <div
                      key={index}
                      className={classnames(
                        styles.selectCourseOption,
                        course_type.constant === courseType && styles.selected
                      )}
                      onClick={() => this.handleClick(course_type)}>
                      {course_type.name}
                    </div>
                  )
              )}
            </div>
          ) : (
            <div className={styles.subtitleInner}>
              {subtitle}{' '}
              <span>
                <i className="fas fa-chevron-down fa-lg" />
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default NavigationItemCourse
