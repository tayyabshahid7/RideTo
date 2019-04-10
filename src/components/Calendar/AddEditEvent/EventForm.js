import React from 'react'
import moment from 'moment'
import { Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import { DAY_FORMAT2, DAY_FORMAT3, DATE_FORMAT } from 'common/constants'
import Loading from 'components/Loading'
import DateHeading from 'components/Calendar/DateHeading'
import pick from 'lodash/pick'

import { getTimeFromDateTime } from 'utils/helper'

import { ConnectInput, ConnectTextArea, Button } from 'components/ConnectForm'

class EventForm extends React.Component {
  constructor(props) {
    super(props)
    const event = {
      name: '',
      start_time: '',
      end_time: '',
      notes: ''
    }
    if (this.props.event) {
      Object.assign(
        event,
        pick(this.props.event, 'name', 'start_time', 'end_time', 'notes')
      )
      event.start_time = moment(event.start_time).format(DAY_FORMAT3)
      event.end_time = moment(event.end_time).format(DAY_FORMAT3)
    } else if (this.props.date) {
      event.date = this.props.date
    }

    this.state = {
      event: event,
      startTime: getTimeFromDateTime(event.start_time),
      endTime: getTimeFromDateTime(event.end_time)
    }
  }

  getStartDate(event) {
    if (this.props.date) {
      return this.props.date
    }

    if (event.start_time) {
      return moment(event.start_time, DAY_FORMAT3).format(DATE_FORMAT)
    }
  }

  handleChangeRawEvent(e) {
    let name = e.target.name
    let { event } = this.state
    event[name] = e.target.value
    this.setState({ event })
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
        `/calendar/${moment(new Date(event.start_time)).format(DATE_FORMAT)}`
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
      start_time: moment(
        `${date} ${this.state.startTime}`,
        'YYYY-MM-DD HH:mm'
      ).format(),
      end_time: moment(
        `${date} ${this.state.endTime}`,
        'YYYY-MM-DD HH:mm'
      ).format()
    }
    onSubmit(event)
  }

  renderTitle() {
    const { event, date } = this.props
    let title = 'Add New Event'
    let backLink = '/calendar'

    if (event) {
      title = moment(new Date(event.start_time)).format(DAY_FORMAT2)
      backLink = `/calendar/${moment(new Date(event.start_time)).format(
        DATE_FORMAT
      )}`
    } else if (date) {
      title = moment(new Date(date)).format(DAY_FORMAT2)
      backLink = `/calendar/${date}`
    }
    return <DateHeading date={moment(date)} title={title} backLink={backLink} />
  }

  render() {
    const { saving, onRemove } = this.props
    const { startTime, endTime } = this.state
    const { name, notes } = this.state.event

    return (
      <div className={styles.container}>
        {this.renderTitle()}
        <Loading loading={saving}>
          {this.props.event && (
            <Row>
              <Col className={styles.actions}>
                <Button onClick={onRemove} color="danger">
                  Remove Event
                </Button>
              </Col>
            </Row>
          )}
          <Form onSubmit={this.handleSave.bind(this)}>
            <Row>
              <Col>
                <ConnectInput
                  basic
                  name="name"
                  value={name}
                  label="Event Name"
                  className="form-group"
                  type="text"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
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
            <Row>
              <Col className="mt-3 text-right">
                <Button type="submit" color="primary">
                  Save
                </Button>
                <Button
                  type="button"
                  color=""
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

export default EventForm
