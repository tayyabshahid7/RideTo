import React, { Component } from 'react'
import moment from 'moment'
import { DATE_FORMAT } from 'common/constants'
import ResultPage from './ResultPage'
import SampleData from './SampleData.json'
import { SORTBY } from 'common/constants'

class ResultPageContainer extends Component {
  constructor(props) {
    super(props)
    this.location = 'Brixton'
    this.courseType = 'Compulsory Basic Training (CBT)'
    this.state = {
      date: moment(new Date()).format(DATE_FORMAT),
      sortByOption: SORTBY.DISTANCE
    }
    this.handleSetDate = this.handleSetDate.bind(this)
    this.handeUpdateOption = this.handeUpdateOption.bind(this)
  }

  handleSetDate(date) {
    this.setState({ date: moment(date).format(DATE_FORMAT) })
  }

  handeUpdateOption(data) {
    this.setState({ ...data })
  }

  render() {
    const { date, sortByOption } = this.state
    return (
      <ResultPage
        location={this.location}
        courseType={this.courseType}
        courses={SampleData.results}
        date={date}
        sortByOption={sortByOption}
        handleSetDate={this.handleSetDate}
        handeUpdateOption={this.handeUpdateOption}
      />
    )
  }
}

export default ResultPageContainer
