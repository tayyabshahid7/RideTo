import React, { Component } from 'react'
import moment from 'moment'
import { DATE_FORMAT } from 'common/constants'
import ResultPage from '../ResultPage/ResultPage'
// import SampleData from './SampleData.json'
import { SORTBY } from 'common/constants'
import { fetchRidetoCourses, getCourseTitle } from 'services/course'
import styles from './CourseAlternativeDatesSelection.scss'
import { fetchSearchLocation } from 'services/geolocation'
import { parseQueryString } from 'services/api'
import { getStaticData } from 'services/page'
import classnames from 'classnames'

class AlternativeLocationsOption extends Component {
  constructor(props) {
    super(props)
    const staticData = getStaticData('RIDETO_PAGE')
    const qs = parseQueryString(window.location.search.slice(1))
    const postcode = staticData.postcode || qs.postcode || ''
    const courseType = staticData.courseType || qs.courseType || ''

    this.navigation = [
      {
        title: 'Postcode',
        subtitle: postcode.toUpperCase(),
        queryValue: `postcode=${postcode}`
      },
      {
        title: 'Course',
        subtitle: getCourseTitle(courseType),
        queryValue: `courseType=${courseType}`
      },
      {
        title: courseType !== 'FULL_LICENCE' ? 'Date & Location' : 'Location',
        subtitle:
        courseType !== 'FULL_LICENCE'
        ? 'Choose a Date & Location'
        : 'Choose a Location',
        active: true
      },
      {
        title: 'Extras',
        disabled: true
      }
    ]

    this.state = {
      date: null,
      sortByOption: SORTBY.DISTANCE,
      userLocation: null,
      postcode,
      courseType,
      courses: null,
      loading: false,
      navigation: this.navigation
    }

  }

  async componentDidMount() {
    this.loadData()

    const userLocation = await fetchSearchLocation(this.state.postcode)

    if (userLocation) {
      this.setState({ userLocation })
    } else {
      this.setState({
        userLocation: {
          lat: 51.711712,
          lng: -0.327693
        }
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { date, sortByOption } = this.state
    if (date !== prevState.date || sortByOption !== prevState.sortByOption) {
      this.loadData()
    }
  }

  loadData() {
    this.loadCourses()
  }

  render() {
    const {
      index,
      date,
      sortByOption,
      userLocation,
      loading,
      courseType,
      postcode,
      navigation
    } = this.state

    const {
      courses
    } = this.props
    const props = this.props

    return (
      <div
        className={classnames(
          styles.alternativeLocationsOption,
          styles.optionWrapper
        )}>
        <div className={styles.optionHeader}>
          <h5 className={styles.optionTitle}>
            <span>{index}. Other instant book locations:</span>
          </h5>

          <p className={styles.optionSupTitle}>
            In your area we also have the below instant book locations. These are
            live instructor diaries, so you're guaranteed to get the space shown.
            Click to move your booking to one of these instructors. Any price
            difference will be automatically refunded or charged.
          </p>
        </div>

        <div className={styles.optionContent}>
          <ResultPage
            {...props}
            postcode={postcode}
            courseType={courseType}
            courses={courses}
            loading={loading}
            date={date}
            sortByOption={sortByOption}
            handleSetDate={null}
            handeUpdateOption={null}
            navigation={navigation}
            userLocation={userLocation}
            />

        </div>
      </div>
    )
  }
}

export default  AlternativeLocationsOption
