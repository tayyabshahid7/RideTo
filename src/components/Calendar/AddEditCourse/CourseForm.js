import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import { Col, Row } from 'reactstrap'
import range from 'lodash/range'
import styles from './styles.scss'
import { DAY_FORMAT3, TEST_STATUS_CHOICES, SHIFT_TYPES } from 'common/constants'
import LoadingMask from 'components/LoadingMask'
import pick from 'lodash/pick'
import BikeNumberPicker from 'components/BikeNumberPicker'
import {
  ConnectInput,
  ConnectSingleSelect,
  ConnectTextArea,
  Button,
  ConnectLabeledContent
} from 'components/ConnectForm'
import { actions as notifyActions } from 'store/notification'
import { getDaysStaff } from 'store/staff'
import { getDaysCourses } from 'store/course'
import { removeWeekdays } from 'utils/helper'
import { DEFAULT_SETTINGS } from 'common/constants'

const fullLicenceBikeFields = [
  'a1_auto_bikes',
  'a2_auto_bikes',
  'a1_manual_bikes',
  'a2_manual_bikes',
  'a_auto_bikes',
  'a_manual_bikes'
]

const generalBikeFields = [
  'own_bikes',
  'auto_bikes',
  'auto_50cc_bikes',
  'auto_125cc_bikes',
  'manual_bikes',
  'manual_50cc_bikes'
]

const bikeFields = [...fullLicenceBikeFields, ...generalBikeFields]

class CourseForm extends React.Component {
  constructor(props) {
    super(props)
    console.log(props.bankHolidays)
    const lastDate = removeWeekdays(moment(props.date), 4, props.bankHolidays)

    const course = {
      course_type_id: '',
      instructor_id: '',
      date: '',
      time: '',
      spaces: '',
      duration: '',
      notes: '',
      test_centre: '',
      last_date_cancel: lastDate,
      status: '',
      application_reference_number: ''
    }

    bikeFields.forEach(field => (course[field] = ''))

    this.setCourseType(course, this.courseTypes)

    let supplier = ''
    if (this.props.schools) {
      supplier = this.props.schools[0].id

      const courseTypes = this.getValidCourseTypes(supplier)
      this.setCourseType(course, courseTypes)
    }

    if (this.props.course) {
      supplier = this.props.course.supplier

      Object.assign(
        course,
        pick(this.props.course, [
          'date',
          'time',
          'spaces',
          'duration',
          'instructor_id',
          'notes',
          'test_centre',
          'last_date_cancel',
          'status',
          'application_reference_number',
          ...bikeFields
        ])
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

    if (course.date) {
      this.props.getDaysStaff({
        start_date: course.date,
        end_date: course.date
      })

      this.props.getDaysCourses({
        start_date: course.date,
        end_date: course.date
      })
    }

    this.state = {
      course: course,
      edited: false,
      defaultBikes: DEFAULT_SETTINGS,
      supplier
    }
  }

  componentDidMount() {
    this.loadPricing()
  }

  componentDidUpdate(prevProps, prevState) {
    const { courseTypes } = this.props.info
    const { course_type_id, date } = this.state.course
    const { supplier } = this.state

    if (courseTypes.length && course_type_id === '') {
      const defaultCourse =
        courseTypes.find(type => type.constant === 'LICENCE_CBT') ||
        courseTypes[0]

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

    if (supplier && supplier !== prevState.supplier) {
      this.loadPricing()
      return
    }
  }

  setCourseType = (course, courseTypes) => {
    if (courseTypes && courseTypes.length) {
      const cbt = courseTypes.find(x => x.constant === 'LICENCE_CBT')
      if (cbt) {
        course.course_type_id = cbt.id
      } else {
        course.course_type_id = courseTypes[0].id
      }
    }
  }

  loadPricing() {
    const { fetchPrice, pricing } = this.props
    const { supplier } = this.state
    const { course_type_id, date } = this.state.course
    if (course_type_id && date) {
      let datetime = moment(date).format(DAY_FORMAT3)
      if (
        pricing.schoolId !== supplier ||
        pricing.course_type !== course_type_id ||
        pricing.datetime !== datetime
      ) {
        fetchPrice({
          course_type: course_type_id,
          schoolId: supplier,
          datetime
        })
      }
    }

    this.loadDefaultBikes()
  }

  loadDefaultBikes() {
    const { supplier } = this.state
    const { course_type_id } = this.state.course
    const { courseTypes } = this.props.info

    const courseTypeId = parseInt(course_type_id)
    const courseType = courseTypes.find(x => x.id === courseTypeId)
    let settings = DEFAULT_SETTINGS

    if (courseType) {
      const bikeSetup = courseType.bike_hire_setup.find(
        x => x.supplier.id === parseInt(supplier)
      )

      if (bikeSetup) {
        settings = bikeSetup
      }
    }

    const isFullLicence = this.checkType()
    const { course } = this.state
    console.log(course)

    if (isFullLicence) {
      fullLicenceBikeFields.forEach(field => {
        if (
          !course.hasOwnProperty(field) ||
          course[field] === '' ||
          !this.props.course
        ) {
          course[field] = settings[field]
        }
      })
    } else {
      generalBikeFields.forEach(field => {
        if (
          !course.hasOwnProperty(field) ||
          course[field] === '' ||
          !this.props.course
        ) {
          if (field === 'manual_bikes') {
            course[field] = settings['default_number_manual_125cc_bikes']
          } else {
            course[field] = settings['default_number_' + field]
          }
        }
      })
    }

    this.setState({
      course,
      defaultBikes: settings
    })
  }

  getFinishTime = (time, duration) => {
    if (!time) {
      return '00:00'
    }

    return moment(time, 'HH:mm')
      .add(duration, 'minute')
      .format('HH:mm')
  }

  handleToggleEdit = () => {
    this.props.onSetEditable(!this.props.isEditable)
  }

  handleChangeFinishTime = ({ target }) => {
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

  handleChangeRawEvent = event => {
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

  validateForm = () => {
    const { staffCalendar, courseCalendar, showNotification } = this.props
    const { supplier, course } = this.state

    if (!supplier) {
      showNotification('Error', 'Please choose a location', 'danger')
      return false
    }

    if (!course.course_type_id) {
      showNotification('Error', 'Please choose a course type', 'danger')
      return false
    }

    if (course.spaces === '') {
      showNotification('Error', 'Please choose a course spaces', 'danger')
      return false
    }
    if (!course.auto_50cc_bikes) {
      course.auto_50cc_bikes = 0
    }

    if (course.duration <= 0) {
      showNotification('Error', 'Invalid time', 'danger')
      return false
    }

    const { date } = course

    // validate instructor
    if (course.instructor_id) {
      // validate diaries
      const diaries = staffCalendar.staff.filter(
        x => x.instructor_id === course.instructor_id
      )
      const allDayDiaries = diaries.filter(
        x => x.event_type !== SHIFT_TYPES[0].id
      )
      if (allDayDiaries.length) {
        showNotification(
          'Error',
          this.getConflictMessage(allDayDiaries[0]),
          'danger'
        )
        return false
      }

      const shiftDiaries = diaries.filter(
        x => x.event_type === SHIFT_TYPES[0].id
      )

      const { startTime: x0, endTime: y0 } = this.getCourseTime(course)

      for (const diary of shiftDiaries) {
        for (const dtime of diary.times) {
          const x1 = moment(`${date}T${dtime.start_time}`)
          const y1 = moment(`${date}T${dtime.end_time}`)

          if (
            (x0.isSameOrAfter(x1) && x0.isSameOrBefore(y1)) ||
            (x1.isSameOrAfter(x0) && x1.isSameOrBefore(y0))
          ) {
            if (diary.supplier_id !== parseInt(supplier)) {
              showNotification(
                'Error',
                'Staff shift location does not match course location',
                'danger'
              )
              return false
            } else {
              // showNotification(
              //   'Error',
              //   "Staff shift doesn't match course",
              //   'danger'
              // )
              // return false
            }
          }
        }
      }

      // validate conflicting courses
      const courses = courseCalendar.courses.filter(
        x =>
          x.instructor &&
          x.instructor.id === course.instructor_id &&
          (!this.props.course || this.props.course.id !== x.id)
      )

      for (const tmp of courses) {
        const { startTime: x1, endTime: y1 } = this.getCourseTime(tmp)

        if (
          (x0.isSameOrAfter(x1) && x0.isSameOrBefore(y1)) ||
          (x1.isSameOrAfter(x0) && x1.isSameOrBefore(y0))
        ) {
          showNotification('Error', 'Overlaps with other course', 'danger')
          return false
        }
      }
    }

    return true
  }

  getCourseTime = course => {
    const startTime = moment(`${course.date}T${course.time.substr(0, 5)}:00`)
    const endTime = moment(startTime).add(course.duration, 'minute')
    return { startTime, endTime }
  }

  getConflictMessage = diary => {
    if (diary.event_type === 'EVENT_BLOCKER') {
      return 'This Staff has a blocker'
    } else if (diary.event_type === 'EVENT_HOLIDAY') {
      return 'This Staff is on holiday'
    } else if (diary.event_type === 'EVENT_SICK_DAY') {
      return 'This Staff has a sick day'
    }
  }

  handleSave = event => {
    event.preventDefault()

    if (!this.validateForm()) {
      return
    }

    const { onSubmit } = this.props
    const { supplier } = this.state

    const course = Object.assign({}, this.state.course)

    bikeFields.forEach(field => {
      if (!course[field]) {
        course[field] = 0
      }
    })

    if (course.last_date_cancel === '') {
      course.last_date_cancel = null
    }

    course.supplier = supplier
    if (!course.instructor_id) {
      delete course.instructor_id
    } else {
      course.instructor_id = parseInt(course.instructor_id)
    }

    onSubmit(course)
    this.setState({
      edited: false
    })
  }

  getValidCourseTypes = supplier => {
    const { info } = this.props
    if (!supplier) {
      supplier = this.state.supplier
    }

    return info.courseTypes.filter(x =>
      x.schoolIds.includes(parseInt(supplier))
    )
  }

  getInstructors = schoolId => {
    let { instructors } = this.props

    return instructors.filter(x => x.supplier.includes(parseInt(schoolId)))
  }

  handleChangeSchool = id => {
    if (
      this.props.course &&
      this.props.course.orders &&
      this.props.course.orders.length
    ) {
      if (this.props.showNotification) {
        this.props.showNotification(
          'Error',
          'Unable to change course location',
          'danger'
        )
      }
      return
    }

    id = parseInt(id)
    let { course_type_id, instructor_id } = this.state.course

    const courseTypes = this.getValidCourseTypes(id)
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
      instructor_id = ''
    }

    this.setState({
      supplier: id,
      edited: true,
      course: { ...this.state.course, course_type_id, instructor_id }
    })
  }

  handleBikeButtonClick = (bikeType, value) => {
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

  checkType = (prefix = 'FULL_LICENCE', suffix = '') => {
    const courseTypes = this.getValidCourseTypes()
    const { course_type_id } = this.state.course

    return courseTypes
      .filter(
        type =>
          type.constant.startsWith(prefix) && type.constant.endsWith(suffix)
      )
      .some(type => type.id === parseInt(course_type_id, 10))
  }

  render() {
    const {
      isEditable,
      saving,
      schools,
      testCentres,
      pricing,
      onRemove,
      orderCount,
      course,
      staffCalendar,
      courseCalendar,
      coursePackage
    } = this.props

    const {
      available_auto_bikes,
      available_auto_50cc_bikes,
      available_auto_125cc_bikes,
      available_manual_50cc_bikes,
      available_manual_125cc_bikes,
      available_own_bikes,
      available_a1_auto_bikes,
      available_a1_manual_bikes,
      available_a2_auto_bikes,
      available_a2_manual_bikes,
      available_a_auto_bikes,
      available_a_manual_bikes
    } = this.state.defaultBikes
    const loading =
      staffCalendar.loading || courseCalendar.loading || coursePackage.loading

    const { edited } = this.state

    const {
      course_type_id,
      instructor_id,
      date,
      time = '',
      spaces,
      duration,
      notes,
      own_bikes,
      auto_bikes,
      auto_50cc_bikes,
      auto_125cc_bikes,
      manual_50cc_bikes,
      manual_bikes,
      a1_auto_bikes,
      a1_manual_bikes,
      a2_auto_bikes,
      a2_manual_bikes,
      a_auto_bikes,
      a_manual_bikes,
      last_date_cancel,
      test_centre,
      status,
      application_reference_number
    } = this.state.course

    const { supplier } = this.state

    const schoolInstructors = this.getInstructors(supplier)
    const instructorOptions = [
      { id: '', name: 'Un-Assigned' },
      ...schoolInstructors.map(instructor => ({
        ...instructor,
        name: `${instructor.first_name} ${instructor.last_name}`
      }))
    ]

    const finishTime = this.getFinishTime(time, duration)

    const courseTypes = this.getValidCourseTypes()

    const isFullLicence = this.checkType()
    const isCBTRenewal = this.checkType('LICENCE_CBT_RENEWAL')
    const isFullLicenceTest = this.checkType('FULL_LICENCE', 'TEST')

    return (
      <div className={styles.wrapper}>
        <div className={styles.formWrapper}>
          <form onSubmit={this.handleSave}>
            <Row>
              <Col>
                <ConnectSingleSelect
                  basic
                  name="school"
                  value={supplier}
                  label="Location"
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
                  label="Course Type"
                  basic
                  name="course_type_id"
                  value={course_type_id}
                  disabled={!isEditable}
                  required
                  onChange={this.handleChangeRawEvent}
                  raw
                  options={courseTypes}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ConnectSingleSelect
                  basic
                  label="Staff"
                  name="instructor_id"
                  value={instructor_id}
                  disabled={!isEditable}
                  onChange={this.handleChangeRawEvent}
                  raw
                  options={instructorOptions}
                />
              </Col>
            </Row>
            <div>
              {!this.props.course && !this.props.date && (
                <Row>
                  <Col>
                    <ConnectInput
                      label="Date"
                      basic
                      name="date"
                      value={date || ''}
                      type="date"
                      disabled={!isEditable}
                      onChange={this.handleChangeRawEvent}
                      required
                    />
                  </Col>
                </Row>
              )}
              <div className={styles.timeRow}>
                <ConnectInput
                  label="Start Time"
                  basic
                  name="time"
                  className={styles.inputDate}
                  value={time}
                  step="60"
                  type="time"
                  disabled={!isEditable}
                  onChange={this.handleChangeRawEvent}
                  required
                />
                <ConnectInput
                  label="Finish Time"
                  basic
                  name="finish_time"
                  className={styles.inputDate}
                  value={finishTime}
                  step="60"
                  type="time"
                  disabled={!isEditable}
                  onChange={this.handleChangeFinishTime}
                  required
                />
              </div>
              <Row>
                <Col>
                  <ConnectSingleSelect
                    required
                    basic
                    label="Course Spaces"
                    name="spaces"
                    value={spaces || ''}
                    disabled={!isEditable}
                    onChange={this.handleChangeRawEvent}
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
                  {available_auto_bikes && (
                    <Row>
                      <Col>
                        <BikeNumberPicker
                          className={styles.numberPicker}
                          label="Automatic"
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
                  {available_auto_50cc_bikes && (
                    <Row>
                      <Col>
                        <BikeNumberPicker
                          className={styles.numberPicker}
                          label="Automatic 50cc"
                          value={auto_50cc_bikes}
                          id="auto_50cc_bikes"
                          isEditable={isEditable}
                          onChange={this.handleChangeRawEvent.bind(this)}
                          onClickMinus={() => {
                            this.handleBikeButtonClick('auto_50cc_bikes', -1)
                          }}
                          onClickPlus={() => {
                            this.handleBikeButtonClick('auto_50cc_bikes', 1)
                          }}
                        />
                      </Col>
                    </Row>
                  )}
                  {available_auto_125cc_bikes && (
                    <Row>
                      <Col>
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
                      <Col>
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
                      <Col>
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
                      <Col>
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
                  {isCBTRenewal && (
                    <BikeNumberPicker
                      label="Own"
                      value={own_bikes}
                      id="own_bikes"
                      isEditable={isEditable}
                      onChange={this.handleChangeRawEvent}
                      onClickMinus={() => {
                        this.handleBikeButtonClick('own_bikes', -1)
                      }}
                      onClickPlus={() => {
                        this.handleBikeButtonClick('own_bikes', 1)
                      }}
                    />
                  )}
                </React.Fragment>
              )}
              {isFullLicence && (
                <React.Fragment>
                  <Row>
                    <Col>
                      <div className={styles.bikesAvailable}>
                        <b>Bikes Available</b>
                      </div>
                      {(available_a1_auto_bikes ||
                        available_a1_manual_bikes) && (
                        <div className={styles.bikesAvailable}>A1</div>
                      )}
                      {available_a1_auto_bikes && (
                        <BikeNumberPicker
                          label="Automatic"
                          value={a1_auto_bikes}
                          id="a1_auto_bikes"
                          isEditable={isEditable}
                          onChange={this.handleChangeRawEvent}
                          onClickMinus={() => {
                            this.handleBikeButtonClick('a1_auto_bikes', -1)
                          }}
                          onClickPlus={() => {
                            this.handleBikeButtonClick('a1_auto_bikes', 1)
                          }}
                        />
                      )}
                      {available_a1_manual_bikes && (
                        <BikeNumberPicker
                          label="Manual"
                          value={a1_manual_bikes}
                          id="a1_manual_bikes"
                          isEditable={isEditable}
                          onChange={this.handleChangeRawEvent}
                          onClickMinus={() => {
                            this.handleBikeButtonClick('a1_manual_bikes', -1)
                          }}
                          onClickPlus={() => {
                            this.handleBikeButtonClick('a1_manual_bikes', 1)
                          }}
                        />
                      )}
                      {(available_a2_auto_bikes ||
                        available_a2_manual_bikes) && (
                        <div className={styles.bikesAvailable}>A2</div>
                      )}
                      {available_a2_auto_bikes && (
                        <BikeNumberPicker
                          label="Automatic"
                          value={a2_auto_bikes}
                          id="a2_auto_bikes"
                          isEditable={isEditable}
                          onChange={this.handleChangeRawEvent}
                          onClickMinus={() => {
                            this.handleBikeButtonClick('a2_auto_bikes', -1)
                          }}
                          onClickPlus={() => {
                            this.handleBikeButtonClick('a2_auto_bikes', 1)
                          }}
                        />
                      )}
                      {available_a2_manual_bikes && (
                        <BikeNumberPicker
                          label="Manual"
                          value={a2_manual_bikes}
                          id="a2_manual_bikes"
                          isEditable={isEditable}
                          onChange={this.handleChangeRawEvent}
                          onClickMinus={() => {
                            this.handleBikeButtonClick('a2_manual_bikes', -1)
                          }}
                          onClickPlus={() => {
                            this.handleBikeButtonClick('a2_manual_bikes', 1)
                          }}
                        />
                      )}
                      {(available_a_auto_bikes || available_a_manual_bikes) && (
                        <div className={styles.bikesAvailable}>A</div>
                      )}
                      {available_a_auto_bikes && (
                        <BikeNumberPicker
                          label="Automatic"
                          value={a_auto_bikes}
                          id="a_auto_bikes"
                          isEditable={isEditable}
                          onChange={this.handleChangeRawEvent}
                          onClickMinus={() => {
                            this.handleBikeButtonClick('a_auto_bikes', -1)
                          }}
                          onClickPlus={() => {
                            this.handleBikeButtonClick('a_auto_bikes', 1)
                          }}
                        />
                      )}
                      {available_a_manual_bikes && (
                        <BikeNumberPicker
                          label="Manual"
                          value={a_manual_bikes}
                          id="a_manual_bikes"
                          isEditable={isEditable}
                          onChange={this.handleChangeRawEvent}
                          onClickMinus={() => {
                            this.handleBikeButtonClick('a_manual_bikes', -1)
                          }}
                          onClickPlus={() => {
                            this.handleBikeButtonClick('a_manual_bikes', 1)
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                  {isFullLicenceTest && (
                    <React.Fragment>
                      <Row>
                        <Col>
                          <ConnectInput
                            label="Test Reference Number"
                            basic
                            name="application_reference_number"
                            value={application_reference_number || ''}
                            type="text"
                            disabled={!isEditable}
                            onChange={this.handleChangeRawEvent}
                            required
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <ConnectInput
                            label="Last date to cancel"
                            basic
                            name="last_date_cancel"
                            value={last_date_cancel || ''}
                            type="date"
                            disabled={!isEditable}
                            onChange={this.handleChangeRawEvent}
                            required
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <ConnectSingleSelect
                            basic
                            label="Test Centre"
                            name="test_centre"
                            value={test_centre}
                            disabled={!isEditable}
                            onChange={this.handleChangeRawEvent}
                            raw
                            options={testCentres}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <ConnectSingleSelect
                            basic
                            label="Test Status"
                            name="status"
                            value={status ? status : ''}
                            disabled={!isEditable}
                            onChange={this.handleChangeRawEvent}
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
              <ConnectLabeledContent label="Course Price" basic name="price">
                {pricing.loading
                  ? '...'
                  : pricing.info
                  ? `£${(pricing.info.price / 100.0).toFixed(2)}`
                  : ''}
              </ConnectLabeledContent>
              <ConnectTextArea
                label="Notes"
                name="notes"
                value={notes}
                type="textarea"
                disabled={!isEditable}
                onChange={this.handleChangeRawEvent}
              />
              {isEditable && (
                <div className={styles.actions}>
                  <div>
                    <Button type="submit" color="primary" disabled={!edited}>
                      Save
                    </Button>
                  </div>
                  <div>
                    <Button color="white" onClick={this.handleToggleEdit}>
                      Cancel
                    </Button>
                  </div>
                  {course && (
                    <div className={styles.actionDelete}>
                      <Button
                        color="danger"
                        onClick={onRemove}
                        disabled={orderCount > 0}>
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
        <LoadingMask loading={saving || loading} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  staffCalendar: state.staff.days,
  courseCalendar: state.course.days,
  coursePackage: state.course.coursePackage,
  bankHolidays: state.info.bankHolidays
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDaysStaff,
      getDaysCourses,
      showNotification: notifyActions.showNotification
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseForm)
