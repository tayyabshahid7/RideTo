import React from 'react'
import moment from 'moment'
import { Col, Row } from 'reactstrap'
import classnames from 'classnames'
import range from 'lodash/range'
import { getDefaultBikeHire } from 'services/course'
import styles from './styles.scss'
import { DAY_FORMAT3, TEST_STATUS_CHOICES } from 'common/constants'
import Loading from 'components/Loading'
import pick from 'lodash/pick'
import BikeNumberPicker from 'components/BikeNumberPicker'
import {
  ConnectInput,
  ConnectSelect,
  ConnectTextArea,
  Button,
  ConnectLabeledContent
} from 'components/ConnectForm'

function removeFullLicence(type) {
  return type.constant !== 'FULL_LICENCE'
}

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
      auto_125cc_bikes: '',
      manual_50cc_bikes: '',
      own_bikes: '',
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
          'auto_125cc_bikes',
          'manual_50cc_bikes',
          'own_bikes',
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
      course: course,
      edited: false,
      defaultBikes: {},
      loadingDefaultBikes: false
    }

    this.handleToggleEdit = this.handleToggleEdit.bind(this)
    this.handleBikeButtonClick = this.handleBikeButtonClick.bind(this)
  }

  componentDidMount() {
    this.loadDefaultBikes()

    if (
      !this.props.info.courseTypes ||
      this.props.info.courseTypes.length === 0
    ) {
      this.props.loadCourseTypes({ schoolId: this.props.schoolId })
    }
    this.loadPricing()
  }

  componentDidUpdate(prevProps, prevState) {
    const { courseTypes } = this.props.info
    const { course_type_id, date } = this.state.course

    this.loadDefaultBikes()

    if (courseTypes.length && course_type_id === '') {
      const defaultCourse =
        courseTypes.find(({ constant }) => constant === 'LICENCE_CBT') ||
        courseTypes.filter(removeFullLicence)[0]

      this.setState(
        {
          course: {
            ...this.state.course,
            course_type_id: defaultCourse.id.toString()
          }
        },
        () => {
          this.loadPricing()
          return
        }
      )
    }

    if (course_type_id && course_type_id !== prevState.course.course_type_id) {
      this.loadPricing()
      return
    }

    if (date && date !== prevState.course.date) {
      this.loadPricing()
      return
    }
  }

  loadPricing() {
    const { fetchPrice, schoolId, pricing } = this.props
    const { course_type_id, date } = this.state.course
    if (course_type_id && date) {
      let datetime = moment(date).format(DAY_FORMAT3)
      if (
        pricing.schoolId !== schoolId ||
        pricing.course_type !== course_type_id ||
        pricing.datetime !== datetime
      ) {
        fetchPrice({ course_type: course_type_id, schoolId, datetime })
      }
    }

    this.loadDefaultBikes()
  }

  loadDefaultBikes() {
    const { newCourse } = this.props
    const { defaultBikes, loadingDefaultBikes } = this.state
    const { course_type_id } = this.state.course
    const { courseTypes } = this.props.info

    if (!course_type_id && courseTypes.length) {
      return
    }

    const activeCourse = courseTypes.find(
      ({ id }) => id === parseInt(course_type_id)
    )

    const constant = activeCourse && activeCourse.constant

    if (!constant) {
      return
    }

    if (defaultBikes.course_type !== constant && !loadingDefaultBikes) {
      this.setState({
        loadingDefaultBikes: true
      })
      getDefaultBikeHire(constant).then(res => {
        this.setState({
          loadingDefaultBikes: false,
          defaultBikes: {
            course_type: constant,
            ...res
          }
        })
        if (newCourse) {
          this.setState({
            course: {
              ...this.state.course,
              a1_auto_bikes: res.a1_auto_bikes,
              a1_manual_bikes: res.a1_manual_bikes,
              a2_auto_bikes: res.a2_auto_bikes,
              a2_manual_bikes: res.a2_manual_bikes,
              a_auto_bikes: res.a_auto_bikes,
              a_manual_bikes: res.a_manual_bikes,
              auto_bikes: res.default_number_auto_50cc_bikes,
              auto_125cc_bikes: res.default_number_auto_125cc_bikes,
              manual_bikes: res.default_number_manual_125cc_bikes,
              own_bikes: res.default_number_own_bikes,
              manual_50cc_bikes: res.default_number_manual_50cc_bikes
            }
          })
        }
      })
    }
  }

  getFinishTime(time, duration) {
    if (!time) {
      return '00:00'
    }

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
      course: { ...course, duration },
      edited: true
    })
  }

  handleChangeRawEvent(event) {
    const { name, value } = event.target
    const { course } = this.state

    this.setState({
      course: {
        ...course,
        [name]: value
      },
      edited: true
    })
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

    if (!course.auto_125cc_bikes) {
      course.auto_125cc_bikes = 0
    }

    if (!course.manual_50cc_bikes) {
      course.manual_50cc_bikes = 0
    }

    if (!course.own_bikes) {
      course.own_bikes = 0
    }
    if (course.last_date_cancel === '') {
      course.last_date_cancel = null
    }

    onSubmit(course)
    this.setState({
      edited: false
    })
  }

  handleBikeButtonClick(bikeType, value) {
    let newValue = parseInt(this.state.course[bikeType] || 0, 10) + value

    if (newValue < 0) {
      newValue = 0
    }

    this.setState({
      course: {
        ...this.state.course,
        [bikeType]: newValue
      },
      edited: true
    })
  }

  render() {
    const {
      isEditable,
      info,
      saving,
      instructors,
      testCentres,
      pricing,
      onRemove
    } = this.props
    const { edited } = this.state

    const {
      available_auto_50cc_bikes,
      available_auto_125cc_bikes,
      available_manual_50cc_bikes,
      available_manual_125cc_bikes,
      available_own_bikes
    } = this.state.defaultBikes

    const {
      course_type_id,
      instructor_id,
      date,
      time = '',
      spaces,
      duration,
      notes,
      auto_bikes,
      auto_125cc_bikes,
      manual_50cc_bikes,
      manual_bikes,
      own_bikes,
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

    const courseTypes = info.courseTypes.filter(removeFullLicence)

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
                  label="Course Type"
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
            <Row>
              <Col sm="8">
                <ConnectSelect
                  basic
                  label="Staff"
                  name="instructor_id"
                  value={instructor_id}
                  disabled={!isEditable}
                  onChange={this.handleChangeRawEvent.bind(this)}
                  raw
                  options={[
                    { id: '', name: 'Select' },
                    ...instructors.map(instructor => ({
                      ...instructor,
                      name: `${instructor.first_name} ${instructor.last_name}`
                    }))
                  ]}
                />
              </Col>
            </Row>
            <div>
              {!this.props.course && !this.props.date && (
                <Row>
                  <Col sm="8">
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
                  </Col>
                </Row>
              )}
              <Row>
                <Col sm="6">
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
                <Col sm="6">
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
                <Col sm={!isFullLicence ? '6' : '8'}>
                  <ConnectSelect
                    required
                    basic
                    label="Course Spaces"
                    name="spaces"
                    value={spaces || ''}
                    disabled={!isEditable}
                    onChange={this.handleChangeRawEvent.bind(this)}
                    raw
                    options={[
                      { id: '', name: 'Select' },
                      ...range(0, 21).map(num => ({
                        id: num.toString(),
                        name: num.toString()
                      }))
                    ]}
                  />
                </Col>
              </Row>
              {!isFullLicence && (
                <React.Fragment>
                  <div className={styles.bikesAvailable}>
                    <b>Bikes Available</b>
                  </div>
                  {available_auto_50cc_bikes && (
                    <Row>
                      <Col sm="10">
                        <BikeNumberPicker
                          className={styles.numberPicker}
                          label="Automatic 50cc"
                          value={auto_bikes}
                          id="auto_bikes"
                          isEditable={isEditable}
                          onChange={this.handleChangeRawEvent.bind(this)}
                          onClickMinus={() => {
                            this.handleBikeButtonClick('auto_bikes', -1)
                          }}
                          onClickPlus={() => {
                            this.handleBikeButtonClick('auto_bikes', 1)
                          }}
                        />
                      </Col>
                    </Row>
                  )}
                  {available_auto_125cc_bikes && (
                    <Row>
                      <Col sm="10">
                        <BikeNumberPicker
                          className={styles.numberPicker}
                          label="Automatic 125cc"
                          value={auto_125cc_bikes}
                          id="auto_125cc_bikes"
                          isEditable={isEditable}
                          onChange={this.handleChangeRawEvent.bind(this)}
                          onClickMinus={() => {
                            this.handleBikeButtonClick('auto_125cc_bikes', -1)
                          }}
                          onClickPlus={() => {
                            this.handleBikeButtonClick('auto_125cc_bikes', 1)
                          }}
                        />
                      </Col>
                    </Row>
                  )}
                  {available_manual_50cc_bikes && (
                    <Row>
                      <Col sm="10">
                        <BikeNumberPicker
                          className={styles.numberPicker}
                          label="Manual 50cc"
                          value={manual_50cc_bikes}
                          id="manual_50cc_bikes"
                          isEditable={isEditable}
                          onChange={this.handleChangeRawEvent.bind(this)}
                          onClickMinus={() => {
                            this.handleBikeButtonClick('manual_50cc_bikes', -1)
                          }}
                          onClickPlus={() => {
                            this.handleBikeButtonClick('manual_50cc_bikes', 1)
                          }}
                        />
                      </Col>
                    </Row>
                  )}
                  {available_manual_125cc_bikes && (
                    <Row>
                      <Col sm="10">
                        <BikeNumberPicker
                          className={styles.numberPicker}
                          label="Manual 125cc"
                          value={manual_bikes}
                          id="manual_bikes"
                          isEditable={isEditable}
                          onChange={this.handleChangeRawEvent.bind(this)}
                          onClickMinus={() => {
                            this.handleBikeButtonClick('manual_bikes', -1)
                          }}
                          onClickPlus={() => {
                            this.handleBikeButtonClick('manual_bikes', 1)
                          }}
                        />
                      </Col>
                    </Row>
                  )}
                  {available_own_bikes && (
                    <Row>
                      <Col sm="10">
                        <BikeNumberPicker
                          className={styles.numberPicker}
                          label="Own Bikes"
                          value={own_bikes}
                          id="own_bikes"
                          isEditable={isEditable}
                          onChange={this.handleChangeRawEvent.bind(this)}
                          onClickMinus={() => {
                            this.handleBikeButtonClick('own_bikes', -1)
                          }}
                          onClickPlus={() => {
                            this.handleBikeButtonClick('own_bikes', 1)
                          }}
                        />
                      </Col>
                    </Row>
                  )}
                </React.Fragment>
              )}
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
              {!isFullLicence && (
                <ConnectLabeledContent label="Course Price" basic name="price">
                  {pricing.loading
                    ? '...'
                    : pricing.info
                    ? `£${(pricing.info.price / 100.0).toFixed(2)}`
                    : ''}
                </ConnectLabeledContent>
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
                  <Button
                    small
                    type="submit"
                    color="primary"
                    disabled={!edited}>
                    Save
                  </Button>
                  <Button small color="white" onClick={this.handleToggleEdit}>
                    Cancel
                  </Button>
                  <Button small color="danger" onClick={onRemove}>
                    Delete
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
