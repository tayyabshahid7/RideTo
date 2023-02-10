import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { fetchRidetoCourses, getCourseTitle } from 'services/course'
import { checkDateAvailability, normalizePostCode } from 'utils/helper'

import { DATE_FORMAT } from 'common/constants'
import moment from 'moment'
import { parseQueryString } from 'services/api'
import { fetchSearchLocation } from 'services/geolocation'
import { getStaticData } from 'services/page'
import { SORTBY } from '../../../common/constants'
import { FilterStateProvider } from './FilterStateProvider'
import ResultPage from './ResultPage'
import StateProvider from './StateProvider'

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
    const filters = qs.filters ? qs.filters.split(',') : []

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
      filters,
      userLocation: null,
      postcode,
      courseType,
      courses: null,
      loading: false,
      navigation: this.navigation,
      sortByModal: sortByOption
    }

    this.handleSetDate = this.handleSetDate.bind(this)
    this.handleUpdateOption = this.handleUpdateOption.bind(this)
    this.loadCourses = this.loadCourses.bind(this)
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

    if (normalizedPostCode !== prevState.postcode) {
      const url = new URL(window.location)
      url.searchParams.set('postcode', normalizedPostCode)
      window.history.pushState(null, '', url.toString())
    }
  }

  async loadCourses(loading = true, lat = null, lng = null) {
    try {
      const {
        date,
        sortByOption,
        courseType,
        postcode,
        radius_miles,
        filters
      } = this.state
      this.setState({ loading: loading })
      let results = await fetchRidetoCourses({
        course_type: courseType,
        postcode: postcode,
        radius_miles: radius_miles,
        lat,
        lng,
        date,
        ordering: sortByOption,
        available: 'True'
      })

      let filtered = results.filter(({ is_available_on: a }) => a)

      if (filters) {
        filtered = filtered.filter(el => {
          return filters.every(f => {
            return el[f] === true
          })
        })
      }

      if (results) {
        this.setState({
          courses: {
            available: results.filter(({ is_available_on: a }) => a),
            unavailable: results.filter(({ is_available_on: a }) => !a),
            filtered
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

  handleUpdateOption(data) {
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
      navigation,
      radius_miles,
      sortByModal
    } = this.state

    return (
      <FilterStateProvider>
        <StateProvider>
          <Router>
            <Route
              render={props => (
                <ResultPage
                  {...props}
                  postcode={postcode}
                  courseType={courseType}
                  radius_miles={radius_miles}
                  courses={courses}
                  loading={loading}
                  date={date}
                  sortByOption={sortByOption}
                  sortByModal={sortByModal}
                  handleSetDate={this.handleSetDate}
                  handleUpdateOption={this.handleUpdateOption}
                  navigation={navigation}
                  userLocation={userLocation}
                  loadCourses={this.loadCourses}
                />
              )}
            />
          </Router>
        </StateProvider>
      </FilterStateProvider>
    )
  }
}

export default ResultPageContainer
