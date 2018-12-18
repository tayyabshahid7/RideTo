import React from 'react'
import { Row, Col, Button } from 'reactstrap'
import moment from 'moment'
import styles from './styles.scss'
import CreateBulkCourse from 'components/Account/CreateBulkCourse'

class AvailabilityCourses extends React.Component {
  constructor(props) {
    super(props)
    let available_days = ['T', 'T', 'T', 'T', 'T', 'F', 'F']
    if (this.props.settings.default_open_days) {
      available_days = this.props.settings.default_open_days.split('')
    }
    this.state = {
      showCreateBulkCourseForm: false,
      available_days
    }
    this.handleAvailableDaysChange = this.handleAvailableDaysChange.bind(this)
  }

  handleAvailableDaysChange(index) {
    let { available_days } = this.state
    available_days[index] = available_days[index] === 'F' ? 'T' : 'F'
    this.setState({ available_days })
  }

  handleCancel() {
    this.setState({ showCreateBulkCourseForm: false })
  }

  handleSaveDefaultDays() {
    const { updateSettings, settings } = this.props
    const { available_days } = this.state
    updateSettings({ ...settings, default_open_days: available_days.join('') })
  }

  handleCreateBulkCourse(data) {
    const { createBulkCourse, schoolId } = this.props
    createBulkCourse({ schoolId, data })
  }

  renderCreateCourse() {
    return (
      <div>
        <h3>Bulk create course</h3>
        <div>Set default courses for your calendar</div>
        <div>
          <Button
            color="primary"
            onClick={() => this.setState({ showCreateBulkCourseForm: true })}>
            New Course
          </Button>
        </div>
      </div>
    )
  }

  renderDefaultDays() {
    const { available_days } = this.state
    const { settingsSaving } = this.props
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
                  .format('dddd')}`}
                :
              </div>
              <div className="col-6">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`customCheck${index}`}
                    checked={day !== 'F'}
                    readOnly
                  />
                  <label
                    className={`custom-control-label ${
                      day === 'F' ? '' : 'text-white'
                    }`}>
                    {day === 'F' ? 'Closed' : 'Open'}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button
          color="primary mt-2"
          onClick={this.handleSaveDefaultDays.bind(this)}
          disabled={settingsSaving}>
          Save
        </Button>
      </div>
    )
  }

  render() {
    const {
      info,
      loadCourseTypes,
      instructors,
      schoolId,
      schools,
      getInstructors,
      history,
      saving,
      error
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
              history={history}
              instructors={instructors}
              loadCourseTypes={loadCourseTypes}
              schoolId={schoolId}
              schools={schools}
              getInstructors={getInstructors}
              available_days={available_days}
              handleCancel={this.handleCancel.bind(this)}
              saving={saving}
              error={error}
            />
          </Col>
        )}
      </Row>
    )
  }
}

export default AvailabilityCourses
