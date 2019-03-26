import React from 'react'
import moment from 'moment'
import { Col, Row } from 'reactstrap'
import classnames from 'classnames'

import styles from './styles.scss'
import { DAY_FORMAT3, TEST_STATUS_CHOICES } from 'common/constants'
import Loading from 'components/Loading'
import pick from 'lodash/pick'

import {
  ConnectInput,
  ConnectSelect,
  ConnectTextArea,
  Button
} from 'components/ConnectForm'

class CourseForm extends React.Component {
  constructor(props) {
    super(props)

    const course = {
      course_type_id: '',
      instructor_id: '',
      date: '',
      time: '',
      spaces: '',
      duration: '',
      notes: '',
      auto_bikes: '',
      manual_bikes: '',
      a1_auto_bikes: '',
      a2_auto_bikes: '',
      a_auto_bikes: '',
      a1_manual_bikes: '',
      a2_manual_bikes: '',
      a_manual_bikes: '',
      test_centre: '',
      last_date_cancel: '',
      status: '',
      application_reference_number: ''
    }
    if (this.props.course) {
      Object.assign(
        course,
        pick(
          this.props.course,
          'date',
          'time',
          'spaces',
          'duration',
          'instructor_id',
          'auto_bikes',
          'manual_bikes',
          'notes',
          'a1_auto_bikes',
          'a2_auto_bikes',
          'a_auto_bikes',
          'a1_manual_bikes',
          'a2_manual_bikes',
          'a_manual_bikes',
          'test_centre',
          'last_date_cancel',
          'status',
          'application_reference_number'
        )
      )
      course.course_type_id =
        typeof this.props.course.course_type === 'string'
          ? this.props.course.course_type
          : this.props.course.course_type.id

      if (this.props.course.instructor) {
        course.instructor_id =
          typeof this.props.course.instructor === 'string'
            ? this.props.course.instructor
            : this.props.course.instructor.id
      }
    } else if (this.props.date) {
      course.date = this.props.date
    }
    this.state = {
      course: course
    }

    this.handleToggleEdit = this.handleToggleEdit.bind(this)
  }

  componentDidMount() {
    if (
      !this.props.info.courseTypes ||
      this.props.info.courseTypes.length === 0
    ) {
      this.props.loadCourseTypes({ schoolId: this.props.schoolId })
    }
    this.loadPricing()
  }

  componentDidUpdate(prevProps) {
    const { courseTypes } = this.props.info
    const { courseTypes: prevCourseTypes } = prevProps.info
    const { course_type_id } = this.state.course

    if (
      courseTypes &&
      prevCourseTypes &&
      courseTypes.length !== prevCourseTypes.length &&
      course_type_id === ''
    ) {
      this.setState(
        {
          course: {
            ...this.state.course,
            course_type_id: courseTypes[0].id
          }
        },
        this.loadPricing()
      )
    } else {
      this.loadPricing()
    }
  }

  loadPricing() {
    const { fetchPrice, schoolId, pricing } = this.props
    const { course_type_id, date, time } = this.state.course
    if (course_type_id && date && time) {
      let datetime = moment(new Date(`${date} ${time}`)).format(DAY_FORMAT3)
      if (
        pricing.schoolId !== schoolId ||
        pricing.course_type !== course_type_id ||
        pricing.datetime !== datetime
      ) {
        fetchPrice({ course_type: course_type_id, schoolId, datetime })
      }
    }
  }

  getFinishTime(time, duration) {
    return moment(time, 'HH:mm')
      .add(duration, 'minute')
      .format('HH:mm')
  }

  handleToggleEdit() {
    this.props.onSetEditable(!this.props.isEditable)
  }

  handleChangeFinishTime({ target }) {
    const { value } = target
    const { course } = this.state
    const duration = moment(value, 'HH:mm').diff(
      moment(course.time, 'HH:mm'),
      'minute'
    )

    this.setState({
      course: { ...course, duration }
    })
  }

  handleChangeRawEvent(event) {
    let name = event.target.name
    let { course } = this.state
    course[name] = event.target.value
    this.setState({ course })
  }

  handleSave(event) {
    event.preventDefault()
    const { onSubmit, info } = this.props
    const {
      course: { instructor_id, ...course }
    } = this.state
    if (instructor_id !== '') {
      course.instructor_id = instructor_id
    } else {
      course.instructor_id = null
    }

    if (!course.course_type_id) {
      course.course_type_id = info.courseTypes[0].id
    }

    if (!course.auto_bikes) {
      course.auto_bikes = 0
    }

    if (!course.manual_bikes) {
      course.manual_bikes = 0
    }

    if (!course.a1_auto_bikes) {
      course.a1_auto_bikes = 0
    }
    if (!course.a1_manual_bikes) {
      course.a1_manual_bikes = 0
    }

    if (!course.a2_auto_bikes) {
      course.a2_auto_bikes = 0
    }
    if (!course.a2_manual_bikes) {
      course.a2_manual_bikes = 0
    }

    if (!course.a_auto_bikes) {
      course.a_auto_bikes = 0
    }
    if (!course.a_manual_bikes) {
      course.a_manual_bikes = 0
    }
    if (course.last_date_cancel === '') {
      course.last_date_cancel = null
    }

    onSubmit(course)
  }

  render() {
    const {
      isEditable,
      info,
      saving,
      instructors,
      testCentres,
      pricing
    } = this.props
    const {
      course_type_id,
      instructor_id,
      date,
      time = '',
      spaces,
      duration,
      notes,
      auto_bikes,
      manual_bikes,
      a1_auto_bikes,
      a2_auto_bikes,
      a_auto_bikes,
      a1_manual_bikes,
      a2_manual_bikes,
      a_manual_bikes,
      last_date_cancel,
      test_centre,
      status,
      application_reference_number
    } = this.state.course

    const finishTime = this.getFinishTime(time, duration)
    // const formClass = isEditable ? styles.grey : ''

    const courseTypes = info.courseTypes.filter(
      type => type.constant !== 'FULL_LICENCE'
    )

    const isFullLicence = courseTypes
      .filter(type => type.constant.startsWith('FULL_LICENCE'))
      .some(type => type.id === parseInt(course_type_id, 10))

    const isFullLicenceTest = courseTypes
      .filter(
        type =>
          type.constant.startsWith('FULL_LICENCE') &&
          type.constant.endsWith('TEST')
      )
      .some(type => type.id === parseInt(course_type_id, 10))

    return (
      <div className={styles.container}>
        <Loading loading={saving}>
          <form onSubmit={this.handleSave.bind(this)}>
            <Row>
              <Col sm="8">
                <ConnectSelect
                  basic
                  name="course_type_id"
                  value={course_type_id}
                  disabled={!isEditable}
                  required
                  onChange={this.handleChangeRawEvent.bind(this)}
                  raw
                  options={courseTypes}
                />
              </Col>
            </Row>
            <div>
              <Row>
                <Col sm="4">
                  <ConnectInput
                    label="Start Time"
                    basic
                    name="time"
                    className={styles.inputDate}
                    value={time.slice(0, 5)}
                    step="60"
                    type="time"
                    disabled={!isEditable}
                    onChange={this.handleChangeRawEvent.bind(this)}
                    required
                  />
                </Col>
                <Col sm="4">
                  <ConnectInput
                    label="Finish Time"
                    basic
                    name="finish_time"
                    className={styles.inputDate}
                    value={finishTime.slice(0, 5)}
                    step="60"
                    type="time"
                    disabled={!isEditable}
                    onChange={this.handleChangeFinishTime.bind(this)}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={!isFullLicence ? '4' : '8'}>
                  <ConnectInput
                    basic
                    label="Spaces"
                    className={styles.inputNumber}
                    name="spaces"
                    value={spaces || ''}
                    type="number"
                    disabled={!isEditable}
                    onChange={this.handleChangeRawEvent.bind(this)}
                    required
                  />
                </Col>
                {!isFullLicence && (
                  <React.Fragment>
                    <Col sm="4">
                      <ConnectInput
                        label="Automatic"
                        basic
                        className={styles.inputNumber}
                        name="auto_bikes"
                        value={auto_bikes || ''}
                        type="number"
                        disabled={!isEditable}
                        onChange={this.handleChangeRawEvent.bind(this)}
                        required
                      />
                    </Col>
                    <Col sm="4">
                      <ConnectInput
                        basic
                        label="Manual"
                        className={styles.inputNumber}
                        name="manual_bikes"
                        value={manual_bikes || ''}
                        type="number"
                        disabled={!isEditable}
                        onChange={this.handleChangeRawEvent.bind(this)}
                        required
                      />
                    </Col>
                  </React.Fragment>
                )}
              </Row>
              {isFullLicence && (
                <React.Fragment>
                  <Row>
                    <Col>
                      <table className={classnames('table', styles.formTable)}>
                        <tbody>
                          <tr>
                            <td />
                            <td>Automatic</td>
                            <td>Manual</td>
                          </tr>
                          <tr>
                            <td>A1</td>
                            <td>
                              <ConnectInput
                                basic
                                className={styles.inputNumber}
                                name="a1_auto_bikes"
                                value={a1_auto_bikes || ''}
                                type="number"
                                min="0"
                                max={spaces}
                                disabled={!isEditable}
                                onChange={this.handleChangeRawEvent.bind(this)}
                                required
                              />
                            </td>
                            <td>
                              <ConnectInput
                                basic
                                className={styles.inputNumber}
                                name="a1_manual_bikes"
                                value={a1_manual_bikes || ''}
                                type="number"
                                min="0"
                                max={spaces}
                                disabled={!isEditable}
                                onChange={this.handleChangeRawEvent.bind(this)}
                                required
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>A2</td>
                            <td>
                              <ConnectInput
                                basic
                                className={styles.inputNumber}
                                name="a2_auto_bikes"
                                value={a2_auto_bikes || ''}
                                type="number"
                                min="0"
                                max={spaces}
                                disabled={!isEditable}
                                onChange={this.handleChangeRawEvent.bind(this)}
                                required
                              />
                            </td>
                            <td>
                              <ConnectInput
                                basic
                                className={styles.inputNumber}
                                name="a2_manual_bikes"
                                value={a2_manual_bikes || ''}
                                type="number"
                                min="0"
                                max={spaces}
                                disabled={!isEditable}
                                onChange={this.handleChangeRawEvent.bind(this)}
                                required
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>A</td>
                            <td>
                              <ConnectInput
                                basic
                                className={styles.inputNumber}
                                name="a_auto_bikes"
                                value={a_auto_bikes || ''}
                                type="number"
                                min="0"
                                max={spaces}
                                disabled={!isEditable}
                                onChange={this.handleChangeRawEvent.bind(this)}
                                required
                              />
                            </td>
                            <td>
                              <ConnectInput
                                basic
                                className={styles.inputNumber}
                                name="a_manual_bikes"
                                value={a_manual_bikes || ''}
                                type="number"
                                min="0"
                                max={spaces}
                                disabled={!isEditable}
                                onChange={this.handleChangeRawEvent.bind(this)}
                                required
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                  {isFullLicenceTest && (
                    <React.Fragment>
                      <Row>
                        <Col sm="8">
                          <ConnectInput
                            label="Test Reference Number"
                            basic
                            name="application_reference_number"
                            value={application_reference_number || ''}
                            type="text"
                            disabled={!isEditable}
                            onChange={this.handleChangeRawEvent.bind(this)}
                            required
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col sm="8">
                          <ConnectInput
                            label="Last date to cancel"
                            basic
                            name="last_date_cancel"
                            value={last_date_cancel || ''}
                            type="date"
                            disabled={!isEditable}
                            onChange={this.handleChangeRawEvent.bind(this)}
                            required
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col sm="8">
                          <ConnectSelect
                            basic
                            label="Test Centre"
                            name="test_centre"
                            value={test_centre}
                            disabled={!isEditable}
                            onChange={this.handleChangeRawEvent.bind(this)}
                            raw
                            options={testCentres}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col sm="8">
                          <ConnectSelect
                            basic
                            label="Test Status"
                            name="status"
                            value={status ? status : ''}
                            disabled={!isEditable}
                            onChange={this.handleChangeRawEvent.bind(this)}
                            raw
                            options={[
                              {
                                id: 'TEST_STATUS_NO_NAME',
                                name: TEST_STATUS_CHOICES.TEST_STATUS_NO_NAME
                              },
                              {
                                id: 'TEST_STATUS_NAMED',
                                name: TEST_STATUS_CHOICES.TEST_STATUS_NAMED
                              },
                              {
                                id: 'TEST_STATUS_NO_BOOKING',
                                name: TEST_STATUS_CHOICES.TEST_STATUS_NO_BOOKING
                              }
                            ]}
                            placeholder
                          />
                        </Col>
                      </Row>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
              {!this.props.course && !this.props.date && (
                <ConnectInput
                  label="Date"
                  basic
                  name="date"
                  value={date || ''}
                  type="date"
                  disabled={!isEditable}
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
                />
              )}
              <Row>
                <Col sm="8">
                  <ConnectSelect
                    basic
                    label="Instructor"
                    name="instructor_id"
                    value={instructor_id}
                    disabled={!isEditable}
                    onChange={this.handleChangeRawEvent.bind(this)}
                    raw
                    options={instructors.map(instructor => ({
                      ...instructor,
                      name: `${instructor.first_name} ${instructor.last_name}`
                    }))}
                  />
                </Col>
              </Row>
              {!isFullLicence && (
                <ConnectInput
                  label="Course Price"
                  basic
                  name="price"
                  value={
                    pricing.loading
                      ? '...'
                      : pricing.info
                      ? `£${(pricing.info.price / 100.0).toFixed(2)}`
                      : ''
                  }
                  disabled
                />
              )}
              <ConnectTextArea
                label="Notes"
                name="notes"
                value={notes}
                type="textarea"
                disabled={!isEditable}
                onChange={this.handleChangeRawEvent.bind(this)}
              />
              {isEditable && (
                <div className={styles.actions}>
                  <Button type="submit" color="primary" className="mr-2">
                    Save
                  </Button>
                  <Button color="white" onClick={this.handleToggleEdit}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Loading>
      </div>
    )
  }
}

export default CourseForm
