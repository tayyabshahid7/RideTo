import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import { parseQueryString } from 'services/api'
import { fetchCoursesTypes, getFilters } from 'services/course-type'
import CourseTypeItem from 'components/RideTo/CourseTypeItem'
import CourseTypeSelectionFilters from 'components/RideTo/CourseTypeSelectionFilters'

class CourseTypeSelection extends React.Component {
  constructor(props) {
    super(props)

    this.filters = getFilters()
    this.courseTypes = []
    this.state = {
      filteredCourseTypes: [],
      selectedFilter: null
    }

    this.handleSelectFilter = this.handleSelectFilter.bind(this)
  }

  async componentDidMount() {
    const qs = parseQueryString(window.location.search.slice(1))
    const result = await fetchCoursesTypes(qs.postcode || '')
    this.courseTypes = result.results

    this.setState({
      filteredCourseTypes: this.courseTypes
    })
  }

  handleSelectFilter(selectedFilter) {
    const filteredCourseTypes = selectedFilter
      ? this.courseTypes.filter(
          ({ tags }) => tags.indexOf(selectedFilter.tag) > -1
        )
      : this.courseTypes

    this.setState({
      selectedFilter,
      filteredCourseTypes
    })
  }

  render() {
    const { filteredCourseTypes, selectedFilter } = this.state

    return (
      <Container>
        <h2>CourseTypeSelection</h2>
        <Row>
          <Col sm="12">
            <CourseTypeSelectionFilters
              filters={this.filters}
              selected={selectedFilter}
              onSelect={this.handleSelectFilter}
            />
          </Col>
        </Row>
        <Row>
          {filteredCourseTypes.map(courseType => (
            <Col sm="4">
              <CourseTypeItem courseType={courseType} />
            </Col>
          ))}
        </Row>
      </Container>
    )
  }
}

export default CourseTypeSelection
