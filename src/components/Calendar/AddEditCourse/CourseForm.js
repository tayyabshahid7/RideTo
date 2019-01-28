import React from 'react'
import moment from 'moment'
import { Col, Row, Button } from 'reactstrap'
import classnames from 'classnames'

import styles from './styles.scss'
import { DAY_FORMAT3 } from 'common/constants'
import Loading from 'components/Loading'
import Input from 'components/Forms/Input'
import pick from 'lodash/pick'

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
      a_manual_bikes: ''
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
          'a_manual_bikes'
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

  componentDidUpdate() {
    this.loadPricing()
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

    onSubmit(course)
  }

  render() {
    const { isEditable, info, saving, instructors, pricing } = this.props
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
      a_manual_bikes
    } = this.state.course

    const finishTime = this.getFinishTime(time, duration)
    const formClass = isEditable ? styles.grey : ''

    const courseTypes = info.courseTypes.filter(
      type => type.constant !== 'FULL_LICENCE'
    )

    const isFullLicence = courseTypes
      .filter(type => type.constant.startsWith('FULL_LICENCE'))
      .some(type => type.id === parseInt(course_type_id, 10))

    return (
      <div className={styles.container}>
        <Loading loading={saving}>
          <form onSubmit={this.handleSave.bind(this)}>
            <div className={styles.formRow}>
              <select
                className={styles.courseTypeSelect}
                name="course_type_id"
                value={course_type_id}
                disabled={!isEditable}
                required
                onChange={this.handleChangeRawEvent.bind(this)}>
                {courseTypes.map(courseType => (
                  <option key={courseType.id} value={courseType.id}>
                    {courseType.name}
                  </option>
                ))}
              </select>
              <Button
                className={styles.editCourse}
                onClick={this.handleToggleEdit}
                disabled={isEditable}
                color="primary"
                outline>
                Edit Course
              </Button>
            </div>

            <div className={classnames(styles.form, formClass)}>
              <Row className={styles.formRow}>
                <Col
                  sm={!isFullLicence ? '4' : '12'}
                  className={styles.formGroup}>
                  <label>Spaces:</label>
                  <Input
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
                    <Col sm="4" className={styles.formGroup}>
                      <label>Automatic:</label>
                      <Input
                        className={styles.inputNumber}
                        name="auto_bikes"
                        value={auto_bikes || ''}
                        type="number"
                        disabled={!isEditable}
                        onChange={this.handleChangeRawEvent.bind(this)}
                        required
                      />
                    </Col>
                    <Col sm="4" className={styles.formGroup}>
                      <label>Manual:</label>
                      <Input
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
                <Row className={styles.formRow}>
                  <Col className={styles.formGroup}>
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
                            <Input
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
                            <Input
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
                            <Input
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
                            <Input
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
                            <Input
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
                            <Input
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
              )}

              {!this.props.course && !this.props.date && (
                <Row className={styles.formRow}>
                  <Col className={styles.formGroup}>
                    <label>Date:</label>
                    <Input
                      name="date"
                      value={date || ''}
                      type="date"
                      disabled={!isEditable}
                      onChange={this.handleChangeRawEvent.bind(this)}
                      required
                    />
                  </Col>
                </Row>
              )}

              <Row className={styles.formRow}>
                <Col sm="6" className={styles.formGroup}>
                  <label>Start Time:</label>
                  <Input
                    name="time"
                    className={styles.inputDate}
                    value={time.slice(0, 5)}
                    label="Start Time"
                    step="60"
                    type="time"
                    disabled={!isEditable}
                    onChange={this.handleChangeRawEvent.bind(this)}
                    required
                  />
                </Col>
                <Col sm="6" className={styles.formGroup}>
                  <label>Finish Time:</label>
                  <Input
                    name="finish_time"
                    className={styles.inputDate}
                    value={finishTime.slice(0, 5)}
                    label="Finish Time"
                    step="60"
                    type="time"
                    disabled={!isEditable}
                    onChange={this.handleChangeFinishTime.bind(this)}
                    required
                  />
                </Col>
              </Row>

              <Row className={styles.formRow}>
                <Col className={styles.formGroup}>
                  <label>Instructor:</label>
                  <select
                    className={styles.formSelect}
                    name="instructor_id"
                    value={instructor_id}
                    disabled={!isEditable}
                    onChange={this.handleChangeRawEvent.bind(this)}>
                    {instructors.map(instructor => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.first_name} {instructor.last_name}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>

              {!isFullLicence && (
                <Row className={styles.formRow}>
                  <Col className={styles.formGroup}>
                    <label>Payout Per Booking:</label>
                    <Input
                      name="price"
                      value={
                        pricing.loading
                          ? '...'
                          : pricing.info
                          ? `£${(pricing.info.payout / 100.0).toFixed(2)}`
                          : ''
                      }
                      disabled
                    />
                  </Col>
                </Row>
              )}

              <div className={styles.formRow}>
                <div className={styles.notes}>
                  <label>Notes:</label>
                  <textarea
                    name="notes"
                    value={notes}
                    type="textarea"
                    disabled={!isEditable}
                    onChange={this.handleChangeRawEvent.bind(this)}
                  />
                </div>
              </div>

              {isEditable && (
                <div className={styles.formRow}>
                  <div className={styles.actions}>
                    <Button type="submit" color="primary" className="mr-2">
                      Save
                    </Button>
                    <Button color="link" onClick={this.handleToggleEdit}>
                      Cancel
                    </Button>
                  </div>
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
