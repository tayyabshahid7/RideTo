import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import { parseQueryString } from 'services/api'
import { fetchCoursesTypes, getFilters } from 'services/course-type'
import CourseTypeItem from 'components/RideTo/CourseTypeItem'
import CourseTypeSelectionFilters from 'components/RideTo/CourseTypeSelectionFilters'
import NavigationComponent from 'components/RideTo/NavigationComponent'

import styles from './CourseTypeSelection.scss'

class CourseTypeSelection extends React.Component {
  constructor(props) {
    super(props)

    const qs = parseQueryString(window.location.search.slice(1))

    this.filters = getFilters()
    this.courseTypes = []
    this.state = {
      filteredCourseTypes: [],
      selectedFilter: null,
      postcode: qs.postcode || ''
    }

    this.navigation = [
      {
        title: 'Postcode',
        subtitle: this.state.postcode
      },
      {
        title: 'Course',
        subtitle: 'Choose a Course',
        active: true
      },
      {
        title: 'Date & Location',
        subtitle: '-',
        disabled: true
      },
      {
        title: 'Extras',
        disabled: true
      }
    ]

    this.handleSelectFilter = this.handleSelectFilter.bind(this)
    this.handleNavigation = this.handleNavigation.bind(this)
  }

  async componentDidMount() {
    const { postcode } = this.state
    const result = await fetchCoursesTypes(postcode || '')
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

  handleNavigation(index) {}

  render() {
    const { postcode, filteredCourseTypes, selectedFilter } = this.state

    return (
      <React.Fragment>
        <NavigationComponent
          navigation={this.navigation}
          onNavClick={this.handleNavigation}
        />
        <Container>
          <Row className={styles.filters}>
            <Col sm="6">
              <h2 className={styles.heading}>Choose Course</h2>
            </Col>
            <Col sm="6">
              <CourseTypeSelectionFilters
                filters={this.filters}
                selected={selectedFilter}
                onSelect={this.handleSelectFilter}
              />
            </Col>
          </Row>
          <Row>
            {filteredCourseTypes.map(courseType => (
              <Col sm="4" key={courseType.name}>
                <CourseTypeItem courseType={courseType} postcode={postcode} />
              </Col>
            ))}
          </Row>
        </Container>
      </React.Fragment>
    )
  }
}

export default CourseTypeSelection
