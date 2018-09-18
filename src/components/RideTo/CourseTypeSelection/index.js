import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import { parseQueryString } from 'services/api'
import { fetchCoursesTypes } from 'services/course-type'
import CourseTypeItem from 'components/RideTo/CourseTypeItem'

class CourseTypeSelection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      courseTypes: []
    }
  }

  async componentDidMount() {
    const qs = parseQueryString(window.location.search.slice(1))
    const result = await fetchCoursesTypes(qs.postcode || '')

    this.setState({
      courseTypes: result.results
    })
  }

  render() {
    const { courseTypes } = this.state

    return (
      <Container>
        <h2>CourseTypeSelection</h2>
        <Row>
          {courseTypes.map(courseType => (
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
