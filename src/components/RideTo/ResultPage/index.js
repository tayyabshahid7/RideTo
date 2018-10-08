import React, { Component } from 'react'
import moment from 'moment'
import { DATE_FORMAT } from 'common/constants'
import ResultPage from './ResultPage'
// import SampleData from './SampleData.json'
import { SORTBY } from 'common/constants'
import { fetchRidetoCourses, getCourseTitle } from 'services/course'
import { fetchSearchLocation } from 'services/geolocation'
import { parseQueryString } from 'services/api'
import { getStaticData } from 'services/page'

class ResultPageContainer extends Component {
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
        title: 'Date & Location',
        subtitle: 'Choose a Date & Location',
        active: true
      },
      {
        title: 'Extras',
        disabled: true
      }
    ]

    this.state = {
      date: moment(new Date()).format(DATE_FORMAT),
      sortByOption: SORTBY.DISTANCE,
      userLocation: {
        lat: 51.711712,
        lng: -0.327693
      },
      postcode,
      courseType,
      courses: [],
      loading: false,
      navigation: this.navigation
    }

    this.handleSetDate = this.handleSetDate.bind(this)
    this.handeUpdateOption = this.handeUpdateOption.bind(this)
  }

  async componentDidMount() {
    this.loadData()

    const userLocation = await fetchSearchLocation(this.state.postcode)
    this.setState({ userLocation })
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

  async loadCourses() {
    try {
      const { date, sortByOption, courseType, postcode } = this.state
      this.setState({ loading: true })
      let response = await fetchRidetoCourses({
        course_type: courseType,
        postcode: postcode,
        radius_miles: 15,
        date,
        ordering: sortByOption
      })
      if (response.results) {
        this.setState({ courses: response.results, loading: false })
      } else {
        this.setState({ courses: [], loading: false })
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
      <ResultPage
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
    )
  }
}

export default ResultPageContainer
