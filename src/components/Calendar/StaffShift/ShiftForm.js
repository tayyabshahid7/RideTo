import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import { Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import { DATE_FORMAT, SHIFT_TYPES } from 'common/constants'
import Loading from 'components/Loading'
import _ from 'lodash'

import { getTimeValue } from 'common/info'
import { getDaysStaff } from 'store/staff'
import { actions as notifyActions } from 'store/notification'
import {
  ConnectSingleSelect,
  ConnectInput,
  Button
} from 'components/ConnectForm'

class ShiftForm extends React.Component {
  constructor(props) {
    super(props)

    const { date = '' } = props

    const staff = {
      instructor_id: props.staffId,
      supplier_id: '',
      start_date: date,
      end_date: date,
      times: [
        {
          start_time: '00:00:00',
          end_time: '00:00:00'
        }
      ],
      event_type: SHIFT_TYPES[0].id
    }

    if (props.eventType) {
      staff.event_type = `EVENT_${props.eventType}`
      if (props.eventType !== 'SHIFT') {
        staff.times = []
      }
    }

    let hasStaff = true
    let schoolList = []
    const { schools, instructors } = props
    const instructor = instructors.find(x => x.id === parseInt(props.staffId))
    if (instructor) {
      staff.instructor_id = instructor.id
      schoolList = schools.filter(x => instructor.supplier.includes(x.id))
      staff.supplier_id = schoolList[0].id
    } else {
      hasStaff = false
    }

    let isEdit = false
    if (this.props.staff) {
      isEdit = true
      const fields = [
        'start_date',
        'end_date',
        'times',
        'event_type',
        'notes',
        'supplier_id'
      ]
      Object.assign(staff, _.pick(this.props.staff, fields))
      if (staff.times) {
        staff.times.forEach(time => {
          time.start_time = time.start_time.substr(0, 5)
          time.end_time = time.end_time.substr(0, 5)
        })
      }
    }

    this.state = { ...staff, hasStaff, schoolList, isEdit }
    this.loadDiaries()
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.start_date !== prevState.start_date ||
      this.state.end_date !== prevState.end_date
    ) {
      this.loadDiaries()
    }
  }

  handleInstructorChange = event => {
    const { name, value } = event.target
    const { instructors, schools } = this.props
    const instructor = instructors.find(x => x.id === parseInt(value))

    const schoolList = schools.filter(x => instructor.supplier.includes(x.id))
    const data = {
      [name]: value,
      schoolList
    }

    if (schoolList.length) {
      data.supplier_id = schoolList[0].id
    } else {
      data.supplier_id = ''
    }

    this.setState(data)
  }

  loadDiaries = () => {
    const { start_date, end_date } = this.state
    if (!start_date || !end_date) {
      return
    }
    if (moment(start_date).isSameOrBefore(moment(end_date))) {
      this.props.getDaysStaff({ start_date, end_date })
    }
  }

  handleChange = name => value => {
    this.setState({ [name]: value })
  }

  handleChangeDate = e => {
    const name = e.target.name
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value

    this.setState({ [name]: value })
  }

  handleChangeTime = index => e => {
    const { name, value } = e.target
    const times = this.state.times.slice()
    times[index][name] = value

    this.setState({ times })
  }

  handleCancel(e) {
    e.preventDefault()
    const { date, history, staff, isPopup, onClose } = this.props

    if (isPopup) {
      onClose && onClose()
      return
    }

    if (date) {
      history.push(`/calendar/${date}`)
    } else if (staff) {
      history.push(
        `/calendar/${moment(new Date(staff.start_time)).format(DATE_FORMAT)}`
      )
    } else {
      history.push(`/calendar`)
    }
  }

  handleNewTime = () => {
    const times = this.state.times.slice()
    times.push({
      start_time: '00:00:00',
      end_time: '00:00:00'
    })

    this.setState({ times })
  }

  handleRemoveTime = index => event => {
    const times = this.state.times.slice()
    times.splice(index, 1)
    this.setState({ times })
  }

  validateForm = () => {
    const { showNotification, staffCalendar } = this.props
    const {
      instructor_id,
      supplier_id,
      start_date,
      end_date,
      times
    } = this.state
    console.log(this.state)

    if (!instructor_id) {
      showNotification('Error', 'Please choose a staff', 'danger')
      return false
    }
    if (!supplier_id) {
      showNotification('Error', 'Please choose a location', 'danger')
      return false
    }
    if (!start_date) {
      showNotification('Error', 'Please choose a start date', 'danger')
      return false
    }
    if (!end_date) {
      showNotification('Error', 'Please choose a end date', 'danger')
      return false
    }
    if (moment(start_date).isAfter(moment(end_date))) {
      showNotification('Error', 'Invalid date range', 'danger')
      return false
    }

    // validate holidays, blockers, sick days
    let diaries = staffCalendar.staff.filter(
      x => x.instructor_id === parseInt(instructor_id)
    )
    if (this.props.staff) {
      diaries = diaries.filter(x => x.id !== this.props.staff.id)
    }

    if (this.state.event_type !== SHIFT_TYPES[0].id) {
      const tmp = this.getConflictDiary(start_date, end_date, diaries)
      if (tmp) {
        showNotification('Error', this.getConflictMessage(tmp), 'danger')
        return
      }
    } else {
      if (!times.length) {
        showNotification('Error', 'Please add an interval', 'danger')
        return false
      }
      for (const time of times) {
        if (getTimeValue(time.start_time) >= getTimeValue(time.end_time)) {
          showNotification('Error', 'Invalid interval', 'danger')
          return false
        }
      }
      // validate with other shifts
      const allDayDiaires = diaries.filter(
        x => x.event_type !== SHIFT_TYPES[0].id
      )

      const tmp = this.getConflictDiary(start_date, end_date, allDayDiaires)
      if (tmp) {
        showNotification('Error', this.getConflictMessage(tmp), 'danger')
        return false
      }
      const shiftDiaries = diaries.filter(
        x => x.event_type === SHIFT_TYPES[0].id
      )

      const dateList = []
      if (start_date === end_date) {
        dateList.push(start_date)
      } else {
        const tmp = moment(start_date)
        while (moment(tmp).isSameOrBefore(moment(end_date))) {
          dateList.push(tmp.format('YYYY-MM-DD'))
          tmp.add(1, 'days')
        }
      }

      for (const date of dateList) {
        for (const time of times) {
          const x0 = moment(`${date}T${time.start_time}`)
          const y0 = moment(`${date}T${time.end_time}`)

          for (const diary of shiftDiaries) {
            for (const dtime of diary.times) {
              const tmp = this.getConflictDiary(date, date, [diary])
              if (!tmp) {
                continue
              }

              const x1 = moment(`${date}T${dtime.start_time}`)
              const y1 = moment(`${date}T${dtime.end_time}`)

              if (
                (x0.isSameOrAfter(x1) && x0.isSameOrBefore(y1)) ||
                (x1.isSameOrAfter(x0) && x1.isSameOrBefore(y0))
              ) {
                console.log(diary)
                showNotification('Error', 'Overlaps with other shift', 'danger')
                return false
              }
            }
          }
        }
      }
    }

    return true
  }

  getConflictMessage = diary => {
    if (diary.event_type === 'EVENT_BLOCKER') {
      return 'This Staff has a blocker'
    } else if (diary.event_type === 'EVENT_HOLIDAY') {
      return 'This Staff is on holiday'
    } else if (diary.event_type === 'EVENT_SICK_DAY') {
      return 'This Staff has a sick day'
    } else {
      return 'Overlaps with other shifts'
    }
  }

  getConflictDiary = (startDate, endDate, diaries) => {
    const x0 = moment(startDate)
    const y0 = moment(endDate)

    for (const diary of diaries) {
      const x1 = moment(diary.start_date)
      const y1 = moment(diary.end_date)

      if (
        (x0.isSameOrAfter(x1) && x0.isSameOrBefore(y1)) ||
        (x1.isSameOrAfter(x0) && x1.isSameOrBefore(y0))
      ) {
        return diary
      }
    }
    return null
  }

  handleSave(e) {
    e.preventDefault()
    if (!this.validateForm()) {
      return
    }

    const { onSubmit } = this.props
    const staff = _.cloneDeep(this.state)
    if (staff.event_type !== 'EVENT_SHIFT') {
      delete staff.supplier_id
    }
    delete staff.schoolList
    delete staff.hasStaff

    staff.start_date = staff.start_date.substr(0, 10)
    staff.end_date = staff.end_date.substr(0, 10)

    onSubmit(staff)
  }

  render() {
    const { saving, onRemove, staff, instructors, staffCalendar } = this.props
    const { schoolList, hasStaff, isEdit } = this.state
    const eventType = SHIFT_TYPES.find(x => x.id === this.state.event_type)

    const instructorOptions = [
      { id: '', name: 'Un-Assigned' },
      ...instructors.map(instructor => ({
        ...instructor,
        name: `${instructor.first_name} ${instructor.last_name}`
      }))
    ]

    return (
      <div className={styles.wrapper}>
        <h4 className={styles.addTitle}>
          {staff ? 'Edit' : 'Add'} {eventType.name}
        </h4>
        <Loading loading={saving || staffCalendar.loading}>
          <Form onSubmit={this.handleSave.bind(this)}>
            {!hasStaff && (
              <Row>
                <Col>
                  <ConnectSingleSelect
                    basic
                    label="Staff"
                    name="instructor_id"
                    value={this.state.instructor_id}
                    onChange={this.handleInstructorChange}
                    raw
                    options={instructorOptions}
                  />
                </Col>
              </Row>
            )}
            {this.state.event_type === 'EVENT_SHIFT' && (
              <Row>
                <Col>
                  <ConnectSingleSelect
                    basic
                    name="supplier_id"
                    value={this.state.supplier_id}
                    label="Location"
                    className="form-group"
                    type="text"
                    onChange={this.handleChange('supplier_id')}
                    required
                    options={schoolList}
                  />
                </Col>
              </Row>
            )}
            {/* <Row>
              <Col>
                <ConnectSelect
                  basic
                  name="event_type"
                  value={this.state.event_type}
                  label="Shift Type"
                  className="form-group"
                  type="text"
                  onChange={this.handleChange('event_type')}
                  required
                  options={SHIFT_TYPES}
                />
              </Col>
            </Row> */}
            {!isEdit && (
              <div className={styles.timeRow}>
                <ConnectInput
                  label="From"
                  basic
                  name="start_date"
                  value={this.state.start_date}
                  type="date"
                  onChange={this.handleChangeDate}
                  required
                />
                <ConnectInput
                  label="Until"
                  basic
                  name="end_date"
                  value={this.state.end_date}
                  type="date"
                  popperPosition="bottom-end"
                  onChange={this.handleChangeDate}
                  required
                />
              </div>
            )}
            {this.state.times.map((time, index) => (
              <div key={index} className={styles.timeRow}>
                <ConnectInput
                  basic
                  name="start_time"
                  id={'start_time' + index}
                  value={time.start_time}
                  label="Start Time"
                  className="form-group"
                  type="time"
                  onChange={this.handleChangeTime(index)}
                  required
                />
                <ConnectInput
                  basic
                  name="end_time"
                  id={'end_time' + index}
                  value={time.end_time}
                  label="End Time"
                  className="form-group"
                  type="time"
                  onChange={this.handleChangeTime(index)}
                  required
                />
                <span
                  className={styles.close}
                  onClick={this.handleRemoveTime(index)}></span>
              </div>
            ))}
            {this.state.event_type === 'EVENT_SHIFT' && (
              <div className={styles.btnLink}>
                <span onClick={this.handleNewTime}>Add Interval</span>
              </div>
            )}
            <div className={styles.actions}>
              <div>
                <Button type="submit" color="primary">
                  Save {eventType.name}
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  color="white"
                  onClick={this.handleCancel.bind(this)}>
                  Cancel
                </Button>
              </div>
              {this.props.staff && (
                <div className={styles.actionDelete}>
                  <Button onClick={onRemove} color="danger">
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </Form>
        </Loading>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  staffCalendar: state.staff.days
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDaysStaff,
      showNotification: notifyActions.showNotification
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShiftForm)
