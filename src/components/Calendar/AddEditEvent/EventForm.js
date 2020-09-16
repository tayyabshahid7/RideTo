import React from 'react'
import moment from 'moment'
import { Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import { DAY_FORMAT3, DATE_FORMAT, EVENT_COLORS } from 'common/constants'
import LoadingMask from 'components/LoadingMask'
import pick from 'lodash/pick'

import { getTimeFromDateTime } from 'utils/helper'

import {
  ConnectSelect,
  ConnectInput,
  ConnectTextArea,
  Button,
  ConnectCheckbox,
  ConnectColorInput
} from 'components/ConnectForm'

class EventForm extends React.Component {
  constructor(props) {
    super(props)
    const event = {
      name: '',
      supplier: '',
      start_time: '',
      end_time: '',
      notes: '',
      colour: EVENT_COLORS[0],
      all_day: false
    }

    if (this.props.schools) {
      event.supplier = this.props.schools[0].id
    }

    if (this.props.event) {
      Object.assign(
        event,
        pick(
          this.props.event,
          'name',
          'supplier',
          'start_time',
          'end_time',
          'notes',
          'colour',
          'all_day'
        )
      )
      event.start_time = moment.utc(event.start_time).format(DAY_FORMAT3)
      event.end_time = moment.utc(event.end_time).format(DAY_FORMAT3)
    } else if (this.props.date) {
      event.date = this.props.date
    }

    this.state = {
      event: event,
      startTime: getTimeFromDateTime(event.start_time) + ':00',
      endTime: getTimeFromDateTime(event.end_time) + ':00'
    }
  }

  getStartDate(event) {
    if (this.props.date) {
      return this.props.date
    }

    if (event.start_time) {
      return moment.utc(event.start_time, DAY_FORMAT3).format(DATE_FORMAT)
    }
  }

  handleChangeSchool = id => {
    this.setState({
      event: { ...this.state.event, supplier: id }
    })
  }

  handleChangeColor = colour => {
    this.setState({
      event: { ...this.state.event, colour }
    })
  }

  handleChangeRawEvent = e => {
    let name = e.target.name
    let { event } = this.state

    this.setState({
      event: {
        ...event,
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
    const { date, history, event } = this.props
    if (date) {
      history.push(`/calendar/${date}`)
    } else if (event) {
      history.push(
        `/calendar/${moment.utc(event.start_time).format(DATE_FORMAT)}`
      )
    } else {
      history.push(`/calendar`)
    }
  }

  handleSave(e) {
    e.preventDefault()
    const { onSubmit } = this.props
    const date = this.getStartDate(this.state.event)
    const event = {
      ...this.state.event,
      start_time: moment
        .utc(`${date} ${this.state.startTime}`, 'YYYY-MM-DD HH:mm:ss')
        .format(),
      end_time: moment
        .utc(`${date} ${this.state.endTime}`, 'YYYY-MM-DD HH:mm:ss')
        .format()
    }
    onSubmit(event)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.event.all_day !== prevState.event.all_day &&
      this.state.event.all_day
    ) {
      this.handleChangeTime('endTime', '23:59')
    }
  }

  render() {
    const { saving, onRemove, schools } = this.props
    const { startTime, endTime } = this.state
    const { supplier, name, notes, colour, all_day } = this.state.event

    return (
      <div className={styles.wrapper}>
        <h4 className={styles.addTitle}>Add Event</h4>
        <div>
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
                <ConnectInput
                  basic
                  name="name"
                  value={name}
                  label="Event Name"
                  className="form-group"
                  type="text"
                  onChange={this.handleChangeRawEvent}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ConnectColorInput
                  name="colour"
                  value={colour}
                  label="Event Colour"
                  className="form-group"
                  type="text"
                  onChange={this.handleChangeColor}
                  required
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
                  label="Book all day"
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
              {this.props.event && (
                <div className={styles.actionDelete}>
                  <Button onClick={onRemove} color="danger">
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </Form>
        </div>
        <LoadingMask loading={saving} />
      </div>
    )
  }
}

export default EventForm
