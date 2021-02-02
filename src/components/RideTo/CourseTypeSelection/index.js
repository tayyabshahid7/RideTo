import React from 'react'
import loadable from '@loadable/component'
import { Container } from 'reactstrap'
import { parseQueryString } from 'services/api'
import { fetchCoursesTypes } from 'services/course-type'
import Button from 'components/RideTo/Button'
import CourseTypeList from 'components/RideTo/CourseTypeList'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import classnames from 'classnames'
import { normalizePostCode } from 'utils/helper'

import Loading from 'components/Loading'

import styles from './CourseTypeSelection.scss'

import { COURSETYPE_ORDER } from 'common/constants'

const SidePanel = loadable(() => import('components/RideTo/SidePanel'))
const CourseTypeDetails = loadable(() =>
  import('components/RideTo/CourseTypeDetails')
)

const isTypeform = courseType => {
  if (courseType === 'TFL_ONE_ON_ONE') {
    return true
  } else {
    return false
  }
}

const getBookUrl = (courseType, postcode) => {
  const normalizedPostCode = normalizePostCode(postcode)

  if (courseType === 'TFL_ONE_ON_ONE') {
    return 'https://rideto.typeform.com/to/axybpw'
  } else {
    return `/course-location/?postcode=${normalizedPostCode}&courseType=${courseType}`
  }
}

class CourseTypeSelection extends React.Component {
  constructor(props) {
    super(props)

    const qs = parseQueryString(window.location.search.slice(1))

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
      postcode: qs.postcode ? qs.postcode.replace('+', ' ') : '',
      selectedCourseType: null,
      navigation: this.navigation,
      loading: true
    }

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

  handleDetails(selectedCourseType) {
    this.setState({
      selectedCourseType,
      detailsImage: selectedCourseType ? selectedCourseType.details.image : null
    })
  }

  render() {
    const { postcode, selectedCourseType, detailsImage, loading } = this.state

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
            <CourseTypeList
              courseTypes={this.courseTypes}
              onDetail={this.handleDetails}
              postcode={postcode}
            />
          </Container>
        </Loading>
        {selectedCourseType && (
          <SidePanel
            footer={footer}
            visible={selectedCourseType !== null}
            headingImage={detailsImage}
            onDismiss={() => this.handleDetails(null)}>
            {selectedCourseType && (
              <CourseTypeDetails courseType={selectedCourseType} />
            )}
          </SidePanel>
        )}
      </React.Fragment>
    )
  }
}

export default CourseTypeSelection
