import React from 'react'
import moment from 'moment'
import { Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import { DAY_FORMAT2, DAY_FORMAT3, DATE_FORMAT } from 'common/constants'
import Loading from 'components/Loading'
import DateHeading from 'components/Calendar/DateHeading'
import pick from 'lodash/pick'

import { getTimeFromDateTime } from 'utils/helper'

import {
  ConnectInput,
  ConnectTextArea,
  Button,
  ConnectCheckbox,
  ConnectSelect
} from 'components/ConnectForm'

class EventForm extends React.Component {
  constructor(props) {
    super(props)
    const staff = {
      instructor: '',
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

  handleChangeRawEvent(e) {
    let name = e.target.name
    let { staff } = this.state

    this.setState({
      staff: {
        ...staff,
        [name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
      }
    })
  }

  handleChangeInstructor(id) {
    this.setState({
      staff: {
        ...this.state.staff,
        instructor: id
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
      history.push(`/calendar/${staff.date}`)
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

  renderTitle() {
    const { staff, date } = this.props
    let title = 'Add New Event'
    let backLink = '/calendar'

    if (staff) {
      title = moment(staff.date).format(DAY_FORMAT2)
      backLink = `/calendar/${moment(staff.date).format(DATE_FORMAT)}`
    } else if (date) {
      title = moment(date).format(DAY_FORMAT2)
      backLink = `/calendar/${date}`
    }
    return (
      <DateHeading
        date={moment(staff.date)}
        title={title}
        backLink={backLink}
      />
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.staff.all_day !== prevState.staff.all_day &&
      this.state.staff.all_day
    ) {
      this.handleChangeTime('endTime', '23:59')
    }
  }

  render() {
    const { saving, onRemove, instructors } = this.props
    const { startTime, endTime } = this.state
    const { instructor, notes, all_day } = this.state.staff

    return (
      <div className={styles.container}>
        {this.renderTitle()}
        <Loading loading={saving}>
          <Form onSubmit={this.handleSave.bind(this)}>
            <Row>
              <Col>
                <ConnectSelect
                  basic
                  name="instructor"
                  value={instructor}
                  label="Instructor"
                  className="form-group"
                  type="text"
                  onChange={this.handleChangeInstructor.bind(this)}
                  required
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
            <Row>
              <Col>
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
              </Col>
              <Col>
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
              </Col>
              <Col>
                <ConnectCheckbox
                  basic
                  vertical
                  name="all_day"
                  checked={all_day}
                  label="All day"
                  className="form-group"
                  onChange={this.handleChangeRawEvent.bind(this)}
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
                  onChange={this.handleChangeRawEvent.bind(this)}
                />
              </Col>
            </Row>
            <div className={styles.actions}>
              <Button small type="submit" color="primary">
                Save
              </Button>
              <Button
                small
                type="button"
                color="white"
                onClick={this.handleCancel.bind(this)}>
                Cancel
              </Button>
              {this.props.staff && (
                <Button small onClick={onRemove} color="danger">
                  Delete
                </Button>
              )}
            </div>
          </Form>
        </Loading>
      </div>
    )
  }
}

export default EventForm
