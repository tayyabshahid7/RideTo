import React, { Component } from 'react'
import styles from './styles.scss'
import { Container, Row, Col } from 'reactstrap'
import { getCourseTitle } from 'services/course'
import { COURSETYPE_ORDER } from 'common/constants'
import Loading from 'components/Loading'

class DesktopHeader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      transitioning: false,
      editablePostcode: this.props.postcode,
      editableCourseType: this.props.courseType
    }

    this.handlePostcodeChange = this.handlePostcodeChange.bind(this)
    this.handlePostcodeSubmit = this.handlePostcodeSubmit.bind(this)
    this.handleCourseTypeChange = this.handleCourseTypeChange.bind(this)
  }

  handlePostcodeChange(event) {
    const { value } = event.target

    this.setState({
      editablePostcode: value
    })
  }

  handlePostcodeSubmit(event) {
    const { handlePostcodeChange } = this.props
    const { editablePostcode } = this.state

    event.preventDefault()

    this.setState({ transitioning: true })
    handlePostcodeChange(editablePostcode)
  }

  handleCourseTypeChange(event) {
    const { value } = event.target
    const { handleCourseChange } = this.props

    this.setState({ transitioning: true })
    handleCourseChange(value)
  }

  render() {
    const { courseType, postcode, courseTypesOptions } = this.props
    const { editableCourseType, editablePostcode, transitioning } = this.state

    return (
      <Loading loading={transitioning}>
        <Container className={styles.container}>
          <Row>
            <Col>
              <h1 className={styles.title}>
                {getCourseTitle(courseType)} {postcode}
              </h1>
              <h2 className={styles.subtitle}>
                Book motorcycle training near you
              </h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={styles.filters}>
                <form
                  className={styles.inputForm}
                  onSubmit={this.handlePostcodeSubmit}>
                  <label htmlFor="postcode">Postcode:</label>
                  <input
                    id="postcode"
                    type="text"
                    value={editablePostcode}
                    placeholder="Enter postcode"
                    onChange={this.handlePostcodeChange}
                  />
                  <button type="submit">
                    <i className="fas fa-search" />
                  </button>
                </form>
                <form className={styles.inputForm}>
                  <label htmlFor="courseType">Course:</label>
                  <select
                    id="courseType"
                    value={editableCourseType}
                    onChange={this.handleCourseTypeChange}>
                    {courseTypesOptions.map(course => {
                      return (
                        COURSETYPE_ORDER.includes(course.constant) && (
                          <option key={course.constant} value={course.constant}>
                            {course.name}
                          </option>
                        )
                      )
                    })}
                  </select>
                  <span>
                    <i className="fas fa-chevron-down" />
                  </span>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </Loading>
    )
  }
}

export default DesktopHeader
