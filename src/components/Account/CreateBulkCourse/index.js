import React from 'react'
import moment from 'moment'
import { Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import Loading from 'components/Loading'
import classnames from 'classnames'
import {
  ConnectInput,
  ConnectSingleSelect,
  Button
} from 'components/ConnectForm'
import { DEFAULT_SETTINGS } from 'common/constants'
import { filterExtraCourses } from 'services/course'

class CreateBulkCourse extends React.Component {
  constructor(props) {
    super(props)

    const { schools } = this.props

    const course = {
      course_type_id: '',
      instructor_id: null,
      start_date: '',
      end_date: '',
      time: '',
      end_time: '',
      spaces: '',
      duration: '',
      notes: '',
      auto_bikes: '',
      auto_50cc_bikes: '',
      manual_bikes: '',
      auto_125cc_bikes: '',
      manual_50cc_bikes: '',
      own_bikes: '',
      a1_auto_bikes: '',
      a2_auto_bikes: '',
      a_auto_bikes: '',
      a1_manual_bikes: '',
      a2_manual_bikes: '',
      a_manual_bikes: '',
      application_reference_number: '',
      test_centre: '',
      last_date_cancel: '',
      status: ''
    }

    this.state = {
      settings: DEFAULT_SETTINGS,
      course: course,
      schoolId: schools[0].id,
      useDefaultDays: false
    }
  }

  componentDidMount() {
    const { info } = this.props

    this.setState(
      {
        course: {
          ...this.state.course,
          course_type_id: info.courseTypes
            .filter(filterExtraCourses)[0]
            .id.toString()
        }
      },
      () => {
        this.updateCourseSettings()
      }
    )
  }

  async componentDidUpdate(prevProps) {
    const { saving, error, history } = this.props

    if (prevProps.saving && !saving) {
      if (!error) {
        // const { start_date } = this.state.course
        // history.push(`/calendar/${start_date}`)
        history.push(`/calendar`)
      }
    }
  }

  updateCourseSettings = () => {
    const {
      info: { courseTypes }
    } = this.props
    let { course, schoolId } = this.state
    const courseTypeId = parseInt(course.course_type_id)
    const courseType = courseTypes.find(x => x.id === courseTypeId)
    let settings = DEFAULT_SETTINGS

    if (courseType) {
      const bikeSetup = courseType.bike_hire_setup.find(
        x => x.supplier.id === parseInt(schoolId)
      )

      if (bikeSetup) {
        settings = bikeSetup
      }
    }

    course = Object.assign(course, {
      auto_bikes: settings.default_number_auto_bikes,
      auto_50cc_bikes: settings.default_number_auto_50cc_bikes,
      manual_bikes: settings.default_number_manual_125cc_bikes,
      auto_125cc_bikes: settings.default_number_auto_125cc_bikes,
      manual_50cc_bikes: settings.default_number_manual_50cc_bikes,
      own_bikes: settings.default_number_own_bikes
    })
    this.setState({
      course,
      settings
    })
  }

  async handleChangeRawEvent(event) {
    const { name, value } = event.target
    let { course } = this.state
    course[name] = value

    this.setState({ course }, () => {
      if (name === 'course_type_id') {
        this.updateCourseSettings()
      }
    })
  }

  handleCancel(event) {
    event.preventDefault()
    const { handleCancel } = this.props
    handleCancel()
  }

  handleSave(event) {
    event.preventDefault()
    const { onSubmit, available_days } = this.props
    const { schoolId } = this.state
    let {
      course_type_id,
      instructor_id,
      time,
      spaces,
      start_date,
      end_date,
      end_time,
      notes,
      auto_bikes,
      auto_50cc_bikes,
      manual_bikes,
      auto_125cc_bikes,
      manual_50cc_bikes,
      own_bikes,
      a1_auto_bikes,
      a2_auto_bikes,
      a_auto_bikes,
      a1_manual_bikes,
      a2_manual_bikes,
      a_manual_bikes
    } = this.state.course

    let repeat = {
      start_date,
      end_date,
      available_days: available_days.join(''),
      supplier: schoolId.toString()
    }
    let duration = moment(`2000-01-01 ${end_time}`).diff(
      moment(`2000-01-01 ${time}`),
      'minutes'
    )
    if (duration < 0) {
      return
    }
    if (start_date > end_date) {
      return
    }
    if (instructor_id === null) {
      instructor_id = ''
    }
    let school_course = {
      course_type_id,
      instructor_id,
      time,
      spaces,
      auto_bikes: auto_bikes || 0,
      auto_50cc_bikes: auto_50cc_bikes || 0,
      manual_bikes: manual_bikes || 0,
      auto_125cc_bikes: auto_125cc_bikes || 0,
      manual_50cc_bikes: manual_50cc_bikes || 0,
      own_bikes: own_bikes || 0,
      notes,
      duration: duration.toString(),
      supplier: schoolId.toString(),
      date: start_date,
      a1_auto_bikes: a1_auto_bikes || 0,
      a2_auto_bikes: a2_auto_bikes || 0,
      a_auto_bikes: a_auto_bikes || 0,
      a1_manual_bikes: a1_manual_bikes || 0,
      a2_manual_bikes: a2_manual_bikes || 0,
      a_manual_bikes: a_manual_bikes || 0,
      last_date_cancel: null
    }
    onSubmit({ school_course, repeat })
  }

  handleChangeSchool = id => {
    id = parseInt(id)
    let { course_type_id, instructor_id } = this.state.course

    const courseTypes = this.getCourseTypes(id)
    const tmp = courseTypes.find(x => x.id === parseInt(course_type_id))
    if (!tmp) {
      course_type_id = ''
      if (courseTypes.length) {
        course_type_id = courseTypes[0].id
      }
    }

    const schoolInstructors = this.getInstructors(id)
    const tmpI = schoolInstructors.find(x => x.id === parseInt(instructor_id))
    if (!tmpI) {
      instructor_id = null
    }

    this.setState(
      {
        schoolId: id,
        course: { ...this.state.course, course_type_id, instructor_id }
      },
      () => {
        this.updateCourseSettings()
      }
    )
  }

  getCourseTypes = schoolId => {
    return this.props.info.courseTypes
      .filter(filterExtraCourses)
      .filter(x => x.schoolIds.includes(parseInt(schoolId)))
  }

  getInstructors = schoolId => {
    let { instructors } = this.props

    return instructors.filter(x => x.supplier.includes(parseInt(schoolId)))
  }

  render() {
    let { saving, schools } = this.props

    const {
      course_type_id,
      instructor_id,
      time,
      spaces,
      start_date,
      end_date,
      end_time,
      notes,
      auto_bikes,
      auto_50cc_bikes,
      manual_bikes,
      auto_125cc_bikes,
      manual_50cc_bikes,
      own_bikes,
      a1_auto_bikes,
      a2_auto_bikes,
      a_auto_bikes,
      a1_manual_bikes,
      a2_manual_bikes,
      a_manual_bikes
    } = this.state.course

    const { schoolId } = this.state

    const {
      default_number_auto_bikes,
      available_auto_bikes,
      default_number_auto_50cc_bikes,
      available_auto_50cc_bikes,
      default_number_auto_125cc_bikes,
      available_auto_125cc_bikes,
      default_number_manual_50cc_bikes,
      available_manual_50cc_bikes,
      default_number_manual_125cc_bikes,
      available_manual_125cc_bikes,
      default_number_own_bikes,
      available_own_bikes
    } = this.state.settings

    const courseTypes = this.getCourseTypes(schoolId)
    const schoolInstructors = this.getInstructors(schoolId)

    const instructorOptions = [
      { id: null, name: 'Un-Assigned' },
      ...schoolInstructors.map(instructor => ({
        ...instructor,
        name: `${instructor.first_name} ${instructor.last_name}`
      }))
    ]

    const isFullLicence = courseTypes
      .filter(type => type.constant.startsWith('FULL_LICENCE'))
      .some(type => type.id === parseInt(course_type_id, 10))

    return (
      <div className={styles.container}>
        <Loading loading={saving}>
          <Form onSubmit={this.handleSave.bind(this)}>
            <Row>
              <Col>
                <ConnectSingleSelect
                  basic
                  name="school"
                  value={schoolId}
                  label="Create default course for"
                  className="form-group"
                  type="text"
                  onChange={this.handleChangeSchool}
                  required
                  options={schools}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ConnectSingleSelect
                  basic
                  name="course_type_id"
                  value={course_type_id}
                  label="Course"
                  valueArray={courseTypes}
                  onChange={this.handleChangeRawEvent.bind(this)}
                  raw
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ConnectInput
                  basic
                  name="spaces"
                  value={spaces}
                  label="Spaces"
                  className="form-group"
                  type="number"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  raw
                  required
                />
              </Col>
              {!isFullLicence && (
                <React.Fragment>
                  {available_auto_50cc_bikes && (
                    <Col>
                      <ConnectInput
                        basic
                        name="auto_50cc_bikes"
                        value={
                          auto_50cc_bikes || default_number_auto_50cc_bikes
                        }
                        label="Automatic 50cc"
                        className="form-group"
                        type="number"
                        onChange={this.handleChangeRawEvent.bind(this)}
                        raw
                      />
                    </Col>
                  )}
                  {available_auto_bikes && (
                    <Col>
                      <ConnectInput
                        basic
                        name="auto_bikes"
                        value={auto_bikes || default_number_auto_bikes}
                        label="Automatic"
                        className="form-group"
                        type="number"
                        onChange={this.handleChangeRawEvent.bind(this)}
                        raw
                      />
                    </Col>
                  )}
                  {available_manual_125cc_bikes && (
                    <Col>
                      <ConnectInput
                        basic
                        name="manual_bikes"
                        value={
                          manual_bikes || default_number_manual_125cc_bikes
                        }
                        label="Manual 125cc"
                        className="form-group"
                        type="number"
                        onChange={this.handleChangeRawEvent.bind(this)}
                        raw
                      />
                    </Col>
                  )}
                  {available_auto_125cc_bikes && (
                    <Col>
                      <ConnectInput
                        basic
                        name="auto_125cc_bikes"
                        value={
                          auto_125cc_bikes || default_number_auto_125cc_bikes
                        }
                        label="Auto 125cc"
                        className="form-group"
                        type="number"
                        onChange={this.handleChangeRawEvent.bind(this)}
                        raw
                      />
                    </Col>
                  )}
                  {available_manual_50cc_bikes && (
                    <Col>
                      <ConnectInput
                        basic
                        name="manual_50cc_bikes"
                        value={
                          manual_50cc_bikes || default_number_manual_50cc_bikes
                        }
                        label="Manual 50cc"
                        className="form-group"
                        type="number"
                        onChange={this.handleChangeRawEvent.bind(this)}
                        raw
                      />
                    </Col>
                  )}
                  {available_own_bikes && (
                    <Col>
                      <ConnectInput
                        basic
                        name="own_bikes"
                        value={own_bikes || default_number_own_bikes}
                        label="Own Bikes"
                        className="form-group"
                        type="number"
                        onChange={this.handleChangeRawEvent.bind(this)}
                        raw
                      />
                    </Col>
                  )}
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
                          <ConnectInput
                            basic
                            className={styles.inputNumber}
                            name="a1_auto_bikes"
                            value={a1_auto_bikes || ''}
                            type="number"
                            min="0"
                            max={spaces}
                            onChange={this.handleChangeRawEvent.bind(this)}
                            raw
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
                            onChange={this.handleChangeRawEvent.bind(this)}
                            raw
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
                            onChange={this.handleChangeRawEvent.bind(this)}
                            raw
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
                            onChange={this.handleChangeRawEvent.bind(this)}
                            raw
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
                            onChange={this.handleChangeRawEvent.bind(this)}
                            raw
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
                            onChange={this.handleChangeRawEvent.bind(this)}
                            raw
                            required
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>
            )}

            <Row>
              <Col>
                <ConnectInput
                  basic
                  name="start_date"
                  value={start_date}
                  label="Start Date"
                  className="form-group"
                  type="date"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  raw
                  required
                />
              </Col>
              <Col>
                <ConnectInput
                  basic
                  name="end_date"
                  value={end_date}
                  label="End Date"
                  className="form-group"
                  type="date"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  raw
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ConnectInput
                  basic
                  name="time"
                  value={time}
                  label="Start Time"
                  className="form-group"
                  type="time"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  raw
                  required
                />
              </Col>
              <Col>
                <ConnectInput
                  basic
                  name="end_time"
                  value={end_time}
                  label="Finish Time"
                  className="form-group"
                  type="time"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  raw
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ConnectSingleSelect
                  basic
                  name="instructor_id"
                  value={instructor_id}
                  label="Staff"
                  valueArray={instructorOptions}
                  onChange={this.handleChangeRawEvent.bind(this)}
                  raw
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ConnectInput
                  basic
                  name="notes"
                  value={notes}
                  label="Notes"
                  type="textarea"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  raw
                />
              </Col>
            </Row>
            <Row>
              <Col className="mt-3 text-right">
                <Button type="submit" color="primary">
                  Save
                </Button>
                <Button
                  type="button"
                  color="white"
                  onClick={this.handleCancel.bind(this)}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </Loading>
      </div>
    )
  }
}

export default CreateBulkCourse
