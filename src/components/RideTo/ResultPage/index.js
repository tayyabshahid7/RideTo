import React, { Component } from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { checkDateAvailability, normalizePostCode } from 'utils/helper'
import { fetchRidetoCourses, getCourseTitle } from 'services/course'

import { DATE_FORMAT } from 'common/constants'
import ResultPage from './ResultPage'
import { SORTBY } from '../../../common/constants'
import StateProvider from './StateProvider'
import { fetchSearchLocation } from 'services/geolocation'
import { getStaticData } from 'services/page'
import moment from 'moment'
import { parseQueryString } from 'services/api'

// import SampleData from './SampleData.json'

class ResultPageContainer extends Component {
  constructor(props) {
    super(props)
    const staticData = getStaticData('RIDETO_PAGE')
    const qs = parseQueryString(window.location.search.slice(1))
    const postcode = staticData.postcode || qs.postcode || ''
    const courseType = staticData.courseType || qs.courseType || ''
    const sortByOption = staticData.sortBy || qs.sortBy || SORTBY.DISTANCE
    const date = qs.date || null
    const radius_miles = qs.radius_miles || 30

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
      date,
      radius_miles,
      sortByOption,
      userLocation: null,
      postcode,
      courseType,
      courses: null,
      loading: false,
      navigation: this.navigation
    }

    this.handleSetDate = this.handleSetDate.bind(this)
    this.handeUpdateOption = this.handeUpdateOption.bind(this)
  }

  async componentDidMount() {
    this.loadCourses()

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
    const {
      date,
      sortByOption,
      postcode,
      courseType,
      radius_miles
    } = this.state
    const normalizedPostCode = normalizePostCode(postcode)
    let dateChecked = null
    if (date !== prevState.date || sortByOption !== prevState.sortByOption) {
      if (date) {
        dateChecked = checkDateAvailability(date)
        window.location = `/course-location/?postcode=${normalizedPostCode}&courseType=${courseType}&radius_miles=${radius_miles}&sortBy=${sortByOption}&date=${dateChecked}`
        return
      }
      window.location = `/course-location/?postcode=${normalizedPostCode}&courseType=${courseType}&radius_miles=${radius_miles}&sortBy=${sortByOption}`
    }
  }

  async loadCourses() {
    try {
      const { date, sortByOption, courseType, postcode, radius_miles } = this.state
      this.setState({ loading: true })
      let results = await fetchRidetoCourses({
        course_type: courseType,
        postcode: postcode,
        radius_miles: radius_miles,
        date,
        ordering: sortByOption,
        available: 'True'
      })
      if (results) {
        this.setState({
          courses: {
            available: results.filter(({ is_available_on: a }) => a),
            unavailable: results.filter(({ is_available_on: a }) => !a)
          },
          loading: false
        })
      } else {
        this.setState({ courses: null, loading: false })
      }
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  handleSetDate(date) {
    this.setState({ date: moment(date).format(DATE_FORMAT) })
  }

  handeUpdateOption(data) {
    this.setState({ ...data })
  }

  render() {
    const {
      date,
      sortByOption,
      userLocation,
      courses,
      loading,
      courseType,
      postcode,
      navigation
    } = this.state

    return (
      <StateProvider>
        <Router>
          <Route
            render={props => (
              <ResultPage
                {...props}
                postcode={postcode}
                courseType={courseType}
                courses={courses}
                loading={loading}
                date={date}
                sortByOption={sortByOption}
                handleSetDate={this.handleSetDate}
                handeUpdateOption={this.handeUpdateOption}
                navigation={navigation}
                userLocation={userLocation}
              />
            )}
          />
        </Router>
      </StateProvider>
    )
  }
}

export default ResultPageContainer
