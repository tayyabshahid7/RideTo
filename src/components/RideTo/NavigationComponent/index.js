import React from 'react'
import styles from './styles.scss'
import moment from 'moment'
import NavigationItem from './NavigationItem'
import NavigationItemPostcode from './NavigationItemPostcode'
import NavigationItemCourse from './NavigationItemCourse'
import ArrowLeft from 'assets/images/rideto/ArrowLeft.svg'
import { fetchCoursesTypes } from 'services/course-type'
import { DAY_FORMAT5 } from 'common/constants'
import classnames from 'classnames'

class NavigationComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      courseTypesOptions: []
    }
  }

  async componentDidMount() {
    const { postcode } = this.props
    const result = await fetchCoursesTypes(postcode || '')
    const courseTypes = result.results
    this.setState({
      courseTypesOptions: courseTypes
    })
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

  handleNavPostcodeClick(postcode) {
    this.props.onPostcodeChange(postcode)
  }

  handleNavCourseClick(course) {
    this.props.onCourseChange(course)
  }

  render() {
    const {
      navigation,
      onNavBack,
      courseType,
      date,
      showDatePicker,
      handleMobileDateClick
    } = this.props
    const { courseTypesOptions } = this.state
    const fullWidth = navigation.length === 1
    const isFullLicence = courseType === 'FULL_LICENCE'

    return (
      <div
        className={classnames(
          styles.container,
          showDatePicker && styles.hiddenOnDesktop
        )}>
        {onNavBack && (
          <div className={styles.backItem} onClick={onNavBack}>
            <img src={ArrowLeft} alt="" />
          </div>
        )}

        {navigation.map((naviItem, index) => {
          if (index === 0 && naviItem.title.toUpperCase() === 'POSTCODE') {
            return (
              <NavigationItemPostcode
                {...naviItem}
                fullWidth={fullWidth}
                onPostcodeUpdate={postcode =>
                  this.handleNavPostcodeClick(postcode)
                }
                key={naviItem.title}
              />
            )
          } else if (naviItem.title.toUpperCase() === 'COURSE') {
            return (
              <NavigationItemCourse
                {...naviItem}
                fullWidth={fullWidth}
                courseType={courseType}
                courseTypesOptions={courseTypesOptions}
                onCourseUpdate={course => this.handleNavCourseClick(course)}
                key={naviItem.title}
              />
            )
          } else {
            return (
              <NavigationItem
                {...naviItem}
                fullWidth={fullWidth}
                onClick={() => this.handleNavClick(index, fullWidth)}
                key={naviItem.title}
              />
            )
          }
        })}

        {!isFullLicence && showDatePicker && (
          <NavigationItem
            className={styles.hiddenOnDesktop}
            title="Date"
            subtitle={moment(date).format(DAY_FORMAT5)}
            onClick={handleMobileDateClick}
            dropDown
          />
        )}
      </div>
    )
  }
}

export default NavigationComponent
