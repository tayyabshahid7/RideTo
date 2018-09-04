import React from 'react'
import { Row, Col, Button } from 'reactstrap'
import moment from 'moment'
import styles from './styles.scss'
import CreateBulkCourse from 'components/Account/CreateBulkCourse'

class AvailabilityCourses extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCreateBulkCourseForm: false,
      available_days: ['T', 'T', 'T', 'T', 'T', 'F', 'F']
    }
    this.handleAvailableDaysChange = this.handleAvailableDaysChange.bind(this)
  }

  renderCreateCourse() {
    return (
      <div>
        <h3>Create Course</h3>
        <div>Set default courses for your calendar</div>
        <div>
          <Button
            onClick={() => this.setState({ showCreateBulkCourseForm: true })}>
            New Course
          </Button>
        </div>
      </div>
    )
  }

  handleAvailableDaysChange(index) {
    let { available_days } = this.state
    available_days[index] = available_days[index] === 'F' ? 'T' : 'F'
    this.setState({ available_days })
  }

  handleCancel() {
    this.setState({ showCreateBulkCourseForm: false })
  }

  renderDefaultDays() {
    const { available_days } = this.state
    return (
      <div className={styles.defaultDays}>
        <div className={styles.subtitle}>Default Days</div>
        <div>Set default days you have courses</div>
        <div>
          {available_days.map((day, index) => (
            <div
              key={index}
              className={styles.defaultDayRow}
              onClick={() => this.handleAvailableDaysChange(index)}>
              <div className="col-6">
                {`${moment()
                  .isoWeekday(index + 1)
                  .format('dddd')}`}:
              </div>
              <div className="col-6">
                <input type="checkbox" checked={day !== 'F'} readOnly />{' '}
                <label htmlFor="ml-1">{day === 'F' ? 'Closed' : ''}</label>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  handleCreateBulkCourse(data) {
    const { createBulkCourse, schoolId } = this.props
    createBulkCourse({ schoolId, data })
  }

  render() {
    const {
      info,
      loadCourseTypes,
      instructors,
      schoolId,
      getInstructors
    } = this.props
    const { showCreateBulkCourseForm, available_days } = this.state
    return (
      <Row className={styles.container}>
        <Col lg={4}>
          {this.renderCreateCourse()}
          {this.renderDefaultDays()}
        </Col>
        {!showCreateBulkCourseForm && (
          <Col lg={8}>
            <Col />
            <Col />
          </Col>
        )}
        {showCreateBulkCourseForm && (
          <Col lg={8}>
            <CreateBulkCourse
              onSubmit={this.handleCreateBulkCourse.bind(this)}
              info={info}
              instructors={instructors}
              loadCourseTypes={loadCourseTypes}
              schoolId={schoolId}
              getInstructors={getInstructors}
              available_days={available_days}
              handleCancel={this.handleCancel.bind(this)}
            />
          </Col>
        )}
      </Row>
    )
  }
}

export default AvailabilityCourses
