import React, { Component } from 'react'
import styles from './styles.scss'
import { Button, Row, Col } from 'reactstrap'
import InputTextGroup from 'components/Forms/InputTextGroup'
import InputSelectGroup from 'components/Forms/InputSelectGroup'

class ChangeDate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: this.props.date,
      time: this.props.time
    }

    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleTimeChange = this.handleTimeChange.bind(this)
    this.handleUpdateClick = this.handleUpdateClick.bind(this)
  }

  handleDateChange(event) {
    this.setState({
      date: event.target.value
    })
  }

  handleTimeChange(event) {
    this.setState({
      time: event.target.value
    })
  }

  handleUpdateClick() {
    const { onSave } = this.props
    const { date, time } = this.state
    const start_time = `${date}T${time}Z`

    onSave({ start_time }, true)
  }

  render() {
    const { times, onCancel } = this.props
    const { date, time } = this.state

    return (
      <div className={styles.form}>
        <Row>
          <Col>
            <InputSelectGroup
              name="time"
              value={time}
              label="Time"
              valueArray={times}
              className="form-group"
              noSelectOption
              onChange={this.handleTimeChange}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <InputTextGroup
              name="date"
              value={date}
              label="Date"
              type="date"
              onChange={this.handleDateChange}
            />
          </Col>
        </Row>
        <Row>
          <Col className="mt-3 text-right">
            <Button
              type="button"
              color="primary"
              className="mr-2"
              onClick={this.handleUpdateClick}>
              Update
            </Button>
            <Button type="button" color="" onClick={onCancel}>
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ChangeDate
