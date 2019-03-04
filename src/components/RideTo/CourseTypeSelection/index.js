import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import { parseQueryString } from 'services/api'
import { fetchCoursesTypes, getFilters } from 'services/course-type'
import CourseTypeItem from 'components/RideTo/CourseTypeItem'
import CourseTypeSelectionFilters from 'components/RideTo/CourseTypeSelectionFilters'
import SidePanel from 'components/RideTo/SidePanel'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import Button from 'components/RideTo/Button'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import classnames from 'classnames'

import Loading from 'components/Loading'

import styles from './CourseTypeSelection.scss'

import { COURSETYPE_ORDER } from 'common/constants'

const getBookUrl = (courseType, postcode) => {
  if (courseType === 'TFL_ONE_ON_ONE') {
    return 'https://rideto.typeform.com/to/axybpw'
  } else {
    return `/course-location/?postcode=${postcode}&courseType=${courseType}`
  }
}

const isTypeform = courseType => {
  if (courseType === 'TFL_ONE_ON_ONE') {
    return true
  } else {
    return false
  }
}

class CourseTypeSelection extends React.Component {
  constructor(props) {
    super(props)

    const qs = parseQueryString(window.location.search.slice(1))

    this.filters = getFilters()
    this.courseTypes = []

    this.navigation = [
      {
        title: 'Postcode',
        subtitle: qs.postcode ? qs.postcode.toUpperCase() : ''
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

    this.state = {
      filteredCourseTypes: [],
      selectedFilter: { tag: 'ALL', name: 'All' },
      postcode: qs.postcode || '',
      selectedCourseType: null,
      navigation: this.navigation,
      loading: true
    }

    this.handleSelectFilter = this.handleSelectFilter.bind(this)
    this.handleDetails = this.handleDetails.bind(this)
    this.handlePostcodeChange = this.handlePostcodeChange.bind(this)
  }

  async componentDidMount() {
    const { postcode } = this.state
    const result = await fetchCoursesTypes(postcode || '')
    this.courseTypes = COURSETYPE_ORDER.map(constant =>
      result.results.find(courseType => courseType.constant === constant)
    ).filter(Boolean)

    this.setState({
      filteredCourseTypes: this.courseTypes,
      loading: false
    })
  }

  handlePostcodeChange(newPostcode) {
    const qs = parseQueryString(window.location.search.slice(1))
    const actualPostcode = qs.postcode ? qs.postcode.toUpperCase() : ''
    if (actualPostcode !== newPostcode) {
      window.location = `${window.location.pathname}?postcode=${newPostcode}`
    }
  }

  handleSelectFilter(selectedFilter) {
    const filteredCourseTypes =
      selectedFilter && selectedFilter.tag !== 'ALL'
        ? this.courseTypes.filter(
            ({ tags }) => tags.indexOf(selectedFilter.tag) > -1
          )
        : this.courseTypes

    this.setState({
      selectedFilter,
      filteredCourseTypes
    })
  }

  handleDetails(selectedCourseType) {
    this.setState({
      selectedCourseType,
      detailsImage: selectedCourseType ? selectedCourseType.details.image : null
    })
  }

  render() {
    const {
      postcode,
      filteredCourseTypes,
      selectedFilter,
      selectedCourseType,
      detailsImage,
      loading
    } = this.state

    const footer = selectedCourseType ? (
      <Button
        className={classnames(
          styles.action,
          isTypeform(selectedCourseType.constant) && 'typeform-share'
        )}
        href={getBookUrl(selectedCourseType.constant, postcode)}>
        <span>Book Now</span>
        <img src={ButtonArrowWhite} alt="arrow" />
      </Button>
    ) : null

    return (
      <React.Fragment>
        {/*
        <NavigationComponent
          onPostcodeChange={postcode => {
            this.handlePostcodeChange(postcode)
          }}
          navigation={navigation}
        />
        */}
        <Loading loading={loading} position="top" cover>
          <Container className={styles.container}>
            <Row>
              <Col sm={{ size: 4, offset: 8 }} className={styles.filtersTitle}>
                Filter Courses
              </Col>
            </Row>
            <Row className={styles.filters}>
              <Col sm="6">
                <h2 className={styles.heading}>Choose a Course</h2>
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
                <Col md="6" lg="4" key={courseType.name}>
                  <CourseTypeItem
                    isTypeform={isTypeform(courseType.constant)}
                    postcode={postcode}
                    courseType={courseType}
                    onClickDetails={this.handleDetails}
                    url={getBookUrl(courseType.constant, postcode)}
                  />
                </Col>
              ))}
            </Row>
          </Container>
        </Loading>
        <SidePanel
          footer={footer}
          visible={selectedCourseType !== null}
          headingImage={detailsImage}
          onDismiss={() => this.handleDetails(null)}>
          {selectedCourseType && (
            <CourseTypeDetails courseType={selectedCourseType} />
          )}
        </SidePanel>
      </React.Fragment>
    )
  }
}

export default CourseTypeSelection
