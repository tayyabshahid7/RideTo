import React from 'react'
import moment from 'moment'
import { Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import { DAY_FORMAT3, DATE_FORMAT, SHIFT_TYPES } from 'common/constants'
import Loading from 'components/Loading'
import pick from 'lodash/pick'

import { getTimeFromDateTime } from 'utils/helper'

import {
  ConnectSelect,
  ConnectInput,
  Button,
  ConnectCheckbox
} from 'components/ConnectForm'

class ShiftForm extends React.Component {
  constructor(props) {
    super(props)
    const staff = {
      event_type: SHIFT_TYPES[0].id,
      supplier: '',
      start_time: '',
      end_time: '',
      notes: '',
      instructor: props.staffId,
      all_day: false,
      date: ''
    }

    if (this.props.schools) {
      staff.supplier = this.props.schools[0].id
    }

    if (this.props.staff) {
      Object.assign(
        staff,
        pick(
          this.props.staff,
          'event_type',
          'supplier',
          'instructor',
          'start_time',
          'end_time',
          'notes',
          'all_day',
          'date'
        )
      )
      staff.start_time = `${staff.date}T${staff.start_time}`
      staff.end_time = `${staff.date}T${staff.end_time}`
    } else if (this.props.date) {
      staff.date = this.props.date
    }

    this.state = {
      staff,
      startTime: getTimeFromDateTime(staff.start_time),
      endTime: getTimeFromDateTime(staff.end_time)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.staff.all_day !== prevState.staff.all_day &&
      this.state.staff.all_day
    ) {
      this.handleChangeTime('endTime', '23:59')
    }
  }

  getStartDate(staff) {
    if (this.props.date) {
      return this.props.date
    }

    if (staff.start_time) {
      return moment(staff.start_time, DAY_FORMAT3).format(DATE_FORMAT)
    }
  }

  handleChangeSchool = id => {
    this.setState({
      staff: { ...this.state.staff, supplier: id }
    })
  }

  handleChangeInstructor = id => {
    this.setState({
      staff: {
        ...this.state.staff,
        instructor: id
      }
    })
  }

  handleChangeType = event_type => {
    this.setState({
      staff: {
        ...this.state.staff,
        event_type
      }
    })
  }

  handleChangeRawEvent = e => {
    let name = e.target.name
    let { staff } = this.state

    this.setState({
      staff: {
        ...staff,
        [name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
      }
    })
  }

  handleChangeTime(field, value) {
    this.setState({
      [field]: value
    })
  }

  handleCancel(e) {
    e.preventDefault()
    const { date, history, staff } = this.props
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

  handleSave(e) {
    e.preventDefault()
    const { onSubmit } = this.props
    const date = this.getStartDate(this.state.staff)
    const staff = {
      ...this.state.staff,
      start_time: moment(
        `${date} ${this.state.startTime}`,
        'YYYY-MM-DD HH:mm'
      ).format('HH:mm:ssZ'),
      end_time: moment(
        `${date} ${this.state.endTime}`,
        'YYYY-MM-DD HH:mm'
      ).format('HH:mm:ssZ')
    }
    onSubmit(staff)
  }

  render() {
    const { saving, onRemove, schools, instructors } = this.props
    const { startTime, endTime } = this.state
    const { instructor, supplier, all_day, event_type } = this.state.staff

    let schoolInstructors = []
    if (supplier) {
      schoolInstructors = instructors[supplier]
    }

    return (
      <div className={styles.wrapper}>
        <h4 className={styles.addTitle}>Add Shift</h4>
        <Loading loading={saving}>
          <Form onSubmit={this.handleSave.bind(this)}>
            <Row>
              <Col>
                <ConnectSelect
                  basic
                  name="supplier"
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
                <ConnectSelect
                  basic
                  name="instructor"
                  value={instructor}
                  label="Staff"
                  className="form-group"
                  type="text"
                  onChange={this.handleChangeInstructor}
                  required
                  options={[
                    { id: '', name: 'Select' },
                    ...schoolInstructors.map(instructor => ({
                      ...instructor,
                      name: `${instructor.first_name} ${instructor.last_name}`
                    }))
                  ]}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ConnectSelect
                  basic
                  name="event_type"
                  value={event_type}
                  label="Shift Type"
                  className="form-group"
                  type="text"
                  onChange={this.handleChangeType}
                  required
                  options={SHIFT_TYPES}
                />
              </Col>
            </Row>
            <div className={styles.timeRow}>
              <ConnectInput
                basic
                name="startTime"
                value={startTime}
                label="Start Time"
                className="form-group"
                type="time"
                onChange={({ target }) =>
                  this.handleChangeTime('startTime', target.value)
                }
                required
              />
              <ConnectInput
                basic
                name="endTime"
                value={endTime}
                label="End Time"
                className="form-group"
                type="time"
                onChange={({ target }) =>
                  this.handleChangeTime('endTime', target.value)
                }
                required
              />
            </div>
            <Row>
              <Col>
                <ConnectCheckbox
                  basic
                  vertical
                  name="all_day"
                  checked={all_day}
                  label="All Day"
                  className="form-group"
                  onChange={this.handleChangeRawEvent}
                />
              </Col>
            </Row>
            <div className={styles.actions}>
              <div>
                <Button type="submit" color="primary">
                  Save
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

export default ShiftForm
