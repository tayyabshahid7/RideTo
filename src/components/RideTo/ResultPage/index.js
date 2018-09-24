import React, { Component } from 'react'
import moment from 'moment'
import { DATE_FORMAT } from 'common/constants'
import ResultPage from './ResultPage'
// import SampleData from './SampleData.json'
import { SORTBY } from 'common/constants'
import { fetchRidetoCourses } from 'services/course'

class ResultPageContainer extends Component {
  constructor(props) {
    super(props)
    this.location = 'Brixton'
    this.courseType = 'Compulsory Basic Training (CBT)'
    this.state = {
      date: moment(new Date()).format(DATE_FORMAT),
      sortByOption: SORTBY.DISTANCE,
      userLocation: {
        lat: 51.711712,
        lng: -0.327693
      },
      courses: [],
      loading: false
    }
    this.handleSetDate = this.handleSetDate.bind(this)
    this.handeUpdateOption = this.handeUpdateOption.bind(this)
    this.handleNavClick = this.handleNavClick.bind(this)
  }

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate(prevProps, prevState) {
    const { date } = this.state
    if (date !== prevState.date) {
      this.loadData()
    }
  }

  loadData() {
    this.loadCourses()
  }

  async loadCourses() {
    try {
      this.setState({ loading: true })
      let response = await fetchRidetoCourses({
        course_type: 'LICENCE_CBT',
        postcode: 'w4 2rd',
        radius_miles: 15
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

  handleNavClick(index) {}

  render() {
    const { date, sortByOption, userLocation, courses, loading } = this.state
    let navigation = [
      {
        title: 'Postcode',
        subtitle: 'Brixton, London'
      },
      {
        title: 'Course',
        subtitle: 'Compulsory Basic Training'
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
    return (
      <ResultPage
        location={this.location}
        courseType={this.courseType}
        courses={courses}
        loading={loading}
        date={date}
        sortByOption={sortByOption}
        handleSetDate={this.handleSetDate}
        handeUpdateOption={this.handeUpdateOption}
        navigation={navigation}
        handleNavClick={this.handleNavClick}
        userLocation={userLocation}
      />
    )
  }
}

export default ResultPageContainer
