import React, { Fragment } from 'react'
import styles from './styles.scss'
import moment from 'moment'
import ArrowLeft from 'assets/images/rideto/ArrowLeft.svg'
import { DAY_FORMAT5 } from 'common/constants'
import classnames from 'classnames'
import { AVAILABLE_COURSE_TYPES } from 'common/constants'

class NavigationComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      formCourseType: this.props.courseType,
      date: this.props.date,
      postcode: this.props.postcode,
      postcodeChanged: false
    }

    this.handleCourseChange = this.handleCourseChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleNavClick(navIndex, fullWidth) {
    const { navigation } = this.props
    let navItem = navigation[navIndex]
    if (fullWidth || navItem.disabled || navItem.active) {
      return
    }
    let url = '/'
    if (navIndex === 0) {
      url = '/'
    } else if (navIndex === 1) {
      url = '/course-type-selection/'
    } else if (navIndex === 2) {
      url = '/course-location/'
    } else if (navIndex === 3) {
      url = '/course-addons/'
    }
    let params = []
    for (let i = 0; i < navIndex; i++) {
      params.push(navigation[i].queryValue)
    }
    window.location = `${url}?${params.join('&')}`
  }

  handleCourseChange(event) {
    this.setState({
      formCourseType: event.target.value
    })
    this.props.onCourseChange(event.target.value)
  }

  handleInputChange({ target }) {
    this.setState({
      postcode: target.value,
      postcodeChanged: true
    })
  }

  handleSubmit(event) {
    const { postcode } = this.state

    event.preventDefault()

    if (postcode.length > 0) {
      this.props.onPostcodeChange(postcode)
    }
  }

  render() {
    const {
      onNavBack,
      courseType,
      date,
      showDatePicker,
      handleMobileDateClick,
      courseTypesOptions,
      showIcons = true
    } = this.props
    const { postcode, formCourseType, postcodeChanged } = this.state
    const isFullLicence = courseType === 'FULL_LICENCE'
    const dateString = date ? moment(date).format(DAY_FORMAT5) : 'Select date'

    return (
      <div
        className={classnames(
          styles.container,
          showDatePicker && styles.hiddenOnDesktop,
          !showIcons && styles.hideIcons
        )}>
        {onNavBack && (
          <div className={styles.backItem} onClick={onNavBack}>
            <img src={ArrowLeft} alt="" />
          </div>
        )}

        <form className={styles.navItemContainer} onSubmit={this.handleSubmit}>
          <div style={{ width: '50%', flexGrow: '1' }}>
            {courseTypesOptions ? (
              <Fragment>
                <select
                  className={styles.navInput}
                  value={formCourseType}
                  onChange={this.handleCourseChange}>
                  {courseTypesOptions.map(
                    (course_type, index) =>
                      AVAILABLE_COURSE_TYPES.includes(course_type.constant) && (
                        <option value={course_type.constant} key={index}>
                          {course_type.name}
                        </option>
                      )
                  )}
                </select>
                <i
                  className={classnames(
                    'fas fa-chevron-down fa-lg',
                    styles.chev
                  )}
                />
              </Fragment>
            ) : (
              'No courses'
            )}
          </div>
          {!isFullLicence && (
            <div style={{ width: '50%', borderLeft: '1px solid lightgrey' }}>
              <button
                type="button"
                className={styles.navInput}
                onClick={handleMobileDateClick}>
                {dateString}
              </button>
              <i
                className={classnames('fas fa-chevron-down fa-lg', styles.chev)}
              />
            </div>
          )}
          <div style={{ display: 'flex', paddingLeft: '10%' }}>
            <i className="fas fa-search fa-lg" />
            <input
              className={classnames(styles.navInput, styles.navInputText)}
              type="text"
              onChange={this.handleInputChange}
              value={postcode}
            />
          </div>
          {postcodeChanged && (
            <div className={styles.submitButtonWrap}>
              <button type="submit" className={styles.submitButton}>
                Search Training
              </button>
            </div>
          )}
        </form>
      </div>
    )
  }
}

export default NavigationComponent
