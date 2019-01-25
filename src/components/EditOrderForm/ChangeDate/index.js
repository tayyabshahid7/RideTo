import React, { Component } from 'react'
import styles from './styles.scss'
import { Button, Row, Col, InputGroup, InputGroupAddon } from 'reactstrap'
import InputTextGroup from 'components/Forms/InputTextGroup'
import InputSelectGroup from 'components/Forms/InputSelectGroup'

class ChangeDate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: this.props.date,
      time: this.props.time,
      timesLoaded: false
    }

    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleTimeChange = this.handleTimeChange.bind(this)
    this.handleFetchTimes = this.handleFetchTimes.bind(this)
    this.handleUpdateClick = this.handleUpdateClick.bind(this)
  }

  async handleFetchTimes() {
    const { loadTimes } = this.props
    const { date } = this.state

    await loadTimes(date)

    this.setState({
      timesLoaded: true
    })
  }

  componentDidMount() {
    this.handleFetchTimes()
  }

  handleDateChange(event) {
    this.setState({
      date: event.target.value,
      time: '',
      timesLoaded: false
    })
  }

  handleTimeChange(event) {
    this.setState({
      time: event.target.value
    })
  }

  handleUpdateClick() {
    const { onSave, times } = this.props
    const { date, time } = this.state
    const start_time = `${date}T${time}Z`
    const { course_id } = times.find(t => t.time === time)
    onSave({ start_time, school_course: course_id }, true)
  }

  render() {
    const { times } = this.props
    const { date, time, timesLoaded } = this.state

    return (
      <div className={styles.form}>
        <Row>
          <Col>
            <label className="control-label">Date</label>
            <InputGroup className="form-group">
              <InputTextGroup
                name="date"
                value={date}
                type="date"
                onChange={this.handleDateChange}
                className={styles.dateInput}
              />
              <InputGroupAddon addonType="append">
                <Button
                  type="button"
                  color="primary"
                  onClick={this.handleFetchTimes}>
                  Search
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputSelectGroup
              name="time"
              value={time}
              label="Time"
              valueArray={
                !timesLoaded
                  ? []
                  : times.map(time => ({
                      title: time.time,
                      value: time.time
                    }))
              }
              noSelectOption
              onChange={this.handleTimeChange}
              disabled={!timesLoaded || !times.length}
            />
            {timesLoaded && !times.length && (
              <span className={styles.noTimes}>
                No times available on this date
              </span>
            )}
          </Col>
        </Row>
        <Row>
          <Col className="mt-3 text-right">
            <Button
              type="button"
              color="primary"
              className="mr-2"
              onClick={this.handleUpdateClick}
              disabled={!date || !time}>
              Update
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ChangeDate
