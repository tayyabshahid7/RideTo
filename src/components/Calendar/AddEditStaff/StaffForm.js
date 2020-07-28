import React from 'react'
import moment from 'moment'
import { Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import { DAY_FORMAT3, DATE_FORMAT } from 'common/constants'
import Loading from 'components/Loading'
import pick from 'lodash/pick'

import { getTimeFromDateTime } from 'utils/helper'

import {
  ConnectInput,
  ConnectTextArea,
  Button,
  ConnectCheckbox,
  ConnectSelect
} from 'components/ConnectForm'

class StaffForm extends React.Component {
  constructor(props) {
    super(props)
    const staff = {
      instructor: '',
      supplier: '',
      start_time: '',
      end_time: '',
      notes: '',
      all_day: false,
      date: ''
    }
    if (this.props.staff) {
      Object.assign(
        staff,
        pick(
          this.props.staff,
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

    if (this.props.schools) {
      staff.supplier = this.props.schools[0].id
    }

    this.state = {
      staff: staff,
      startTime: getTimeFromDateTime(staff.start_time),
      endTime: getTimeFromDateTime(staff.end_time)
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

  handleChangeInstructor = id => {
    this.setState({
      staff: {
        ...this.state.staff,
        instructor: id
      }
    })
  }

  handleChangeSchool = id => {
    this.setState({
      staff: { ...this.state.staff, supplier: id }
    })
  }

  handleChangeTime(field, value) {
    this.setState({
      [field]: value
    })
  }

  handleCancel = e => {
    e.preventDefault()
    const { date, history, staff } = this.props
    if (date) {
      history.push(`/calendar/${date}`)
    } else if (staff) {
      history.push(`/calendar/${staff.date}`)
    } else {
      history.push(`/calendar`)
    }
  }

  handleSave = e => {
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

  //   renderTitle() {
  //     const { staff, date } = this.props
  //     let title = 'Add New Event'
  //     let backLink = '/calendar'
  //
  //     if (staff) {
  //       title = moment(staff.date).format(DAY_FORMAT2)
  //       backLink = `/calendar/${moment(staff.date).format(DATE_FORMAT)}`
  //     } else if (date) {
  //       title = moment(date).format(DAY_FORMAT2)
  //       backLink = `/calendar/${date}`
  //     }
  //     return (
  //       <DateHeading
  //         date={staff ? moment(staff.date) : moment(date)}
  //         title={title}
  //         backLink={backLink}
  //       />
  //     )
  //   }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.staff.all_day !== prevState.staff.all_day &&
      this.state.staff.all_day
    ) {
      this.handleChangeTime('endTime', '23:59')
    }
  }

  render() {
    const { saving, onRemove, instructors, schools } = this.props
    const { startTime, endTime } = this.state
    const { instructor, supplier, notes, all_day } = this.state.staff

    let schoolInstructors = []
    if (supplier) {
      schoolInstructors = instructors[supplier]
    }

    return (
      <div className={styles.wrapper}>
        <h4 className={styles.addTitle}>Add Staff</h4>
        <Loading className={styles.formWrapper} loading={saving}>
          <Form className={styles.formContent} onSubmit={this.handleSave}>
            <div className={styles.formTop}>
              <Row>
                <Col>
                  <ConnectSelect
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
                    name="all_day"
                    checked={all_day}
                    label="All Day"
                    className="form-group"
                    onChange={this.handleChangeRawEvent}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <ConnectTextArea
                    basic
                    name="notes"
                    value={notes}
                    label="Notes"
                    type="textarea"
                    onChange={this.handleChangeRawEvent}
                  />
                </Col>
              </Row>
            </div>
            <div className={styles.actions}>
              <div>
                <Button type="submit" color="primary">
                  Save Staff
                </Button>
              </div>
              <div>
                <Button type="button" color="white" onClick={this.handleCancel}>
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

export default StaffForm
