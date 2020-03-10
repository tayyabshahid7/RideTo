import React from 'react'
import moment from 'moment'
import { Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import Loading from 'components/Loading'
import classnames from 'classnames'
import SchoolSelect from 'components/SchoolSelect'
import { ConnectInput, ConnectSelect, Button } from 'components/ConnectForm'
import { DEFAULT_SETTINGS } from 'common/constants'
import * as _ from 'lodash'
import { filterExtraCourses, getDefaultBikeHire } from 'services/course'

class CreateBulkCourse extends React.Component {
  constructor(props) {
    super(props)

    const course = {
      course_type_id: '',
      instructor_id: '',
      start_date: '',
      end_date: '',
      time: '',
      end_time: '',
      spaces: '',
      duration: '',
      notes: '',
      auto_bikes: '',
      auto_50_bikes: '',
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
      useDefaultDays: false,
      useDefaultBikeAmounts: true
    }
    this.getSchoolName = this.getSchoolName.bind(this)
  }

  async componentDidMount() {
    const {
      getInstructors,
      info,
      instructors,
      loadCourseTypes,
      schoolId
    } = this.props
    if (!info.courseTypes || info.courseTypes.length === 0) {
      loadCourseTypes({ schoolId: schoolId })
    } else {
      this.setState({
        course: {
          ...this.state.course,
          course_type_id: info.courseTypes
            .filter(filterExtraCourses)[0]
            .id.toString()
        }
      })
    }

    if (!instructors || instructors.length === 0) {
      getInstructors(schoolId)
    } else {
      this.setState({
        course: {
          ...this.state.course,
          instructor_id: instructors[0].id.toString()
        }
      })
    }
  }

  loadCourseSettings = async (course_type_id, schoolId) => {
    try {
      const currentCourseTypeConstant = _.find(
        this.props.info.courseTypes,
        courseType => courseType.id.toString() === course_type_id
      ).constant
      const response = await getDefaultBikeHire(
        currentCourseTypeConstant,
        schoolId
      )
      this.setState({
        settings: response,
        useDefaultBikeAmounts: false
      })
      return {
        ...this.state.course,
        auto_bikes: response.default_number_auto_bikes,
        auto_50_bikes: response.default_number_auto_50cc_bikes,
        manual_bikes: response.default_number_manual_125cc_bikes,
        auto_125cc_bikes: response.default_number_auto_125cc_bikes,
        manual_50cc_bikes: response.default_number_manual_50cc_bikes,
        own_bikes: response.default_number_own_bikes
      }
    } catch (error) {
      this.setState({
        settings: DEFAULT_SETTINGS
      })
      return null
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      saving,
      error,
      history,
      info: { courseTypes },
      instructors
    } = this.props
    const {
      course: { course_type_id, instructor_id }
    } = this.state

    if (prevProps.saving && !saving) {
      if (!error) {
        const { start_date } = this.state.course
        history.push(`/calendar/${start_date}`)
      }
    }

    if (course_type_id === '' && courseTypes.length) {
      this.setState({
        course: {
          ...this.state.course,
          course_type_id: courseTypes
            .filter(filterExtraCourses)[0]
            .id.toString()
        }
      })
    }

    if (instructor_id === '' && instructors.length) {
      this.setState({
        course: {
          ...this.state.course,
          instructor_id: instructors[0].id.toString()
        }
      })
    }
    if (this.state.course.course_type_id && this.state.useDefaultBikeAmounts) {
      let { course } = this.state
      const updatedCourse = await this.loadCourseSettings(
        this.state.course.course_type_id,
        this.props.schoolId
      )
      if (updatedCourse) course = updatedCourse
      this.setState({ course })
    }
  }

  async handleChangeRawEvent(event) {
    let name = event.target.name
    let { course } = this.state
    course[name] = event.target.value
    if (name === 'course_type_id') {
      const updatedCourse = await this.loadCourseSettings(
        course.course_type_id,
        this.props.schoolId
      )
      if (updatedCourse) course = updatedCourse
    }
    this.setState({ course })
  }

  handleCancel(event) {
    event.preventDefault()
    const { handleCancel } = this.props
    handleCancel()
  }

  handleSave(event) {
    event.preventDefault()
    const { onSubmit, available_days, schoolId } = this.props
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
      auto_50_bikes,
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
    let school_course = {
      course_type_id,
      instructor_id,
      time,
      spaces,
      auto_bikes: auto_bikes || 0,
      auto_50_bikes: auto_50_bikes || 0,
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

  getSchoolName(schoolId) {
    const { schools } = this.props
    for (var i = schools.length - 1; i >= 0; i--) {
      if (schools[i].id === parseInt(schoolId)) return schools[i].name
    }
  }

  render() {
    let { schoolId, info, saving, instructors } = this.props
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
      auto_50_bikes,
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
    const courseTypes = info.courseTypes.filter(filterExtraCourses)

    const isFullLicence = courseTypes
      .filter(type => type.constant.startsWith('FULL_LICENCE'))
      .some(type => type.id === parseInt(course_type_id, 10))

    return (
      <div className={styles.container}>
        <div className={styles.title}>
          Create default course for{' '}
          <div className={styles.select}>
            <SchoolSelect selected={schoolId} small />
          </div>
        </div>
        <Loading loading={saving}>
          <Form onSubmit={this.handleSave.bind(this)}>
            <Row>
              <Col>
                <ConnectSelect
                  basic
                  name="course_type_id"
                  value={course_type_id}
                  label=""
                  valueArray={courseTypes.map(courseType => ({
                    id: courseType.id,
                    name: courseType.name
                  }))}
                  noSelectOption
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
                        name="auto_50_bikes"
                        value={auto_50_bikes || default_number_auto_50cc_bikes}
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
                <ConnectSelect
                  basic
                  name="instructor_id"
                  value={instructor_id}
                  label="Staff"
                  valueArray={instructors.map(instructor => ({
                    id: instructor.id,
                    name: `${instructor.first_name} ${instructor.last_name}`
                  }))}
                  noSelectOption
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
