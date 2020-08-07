import React from 'react'
import moment from 'moment'
import { Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import { DATE_FORMAT, SHIFT_TYPES } from 'common/constants'
import Loading from 'components/Loading'
import _ from 'lodash'

import { ConnectSelect, ConnectInput, Button } from 'components/ConnectForm'

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
          start_time: '',
          end_time: ''
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

    let schoolList = []
    const { schools, instructors } = props
    const instructor = instructors.find(x => x.id === parseInt(props.staffId))
    if (instructor) {
      staff.instructor_id = instructor.id
      schoolList = schools.filter(x => instructor.supplier.includes(x.id))
      staff.supplier_id = schoolList[0].id
    }

    if (this.props.staff) {
      const fields = [
        'start_date',
        'end_date',
        'times',
        'event_type',
        'notes',
        'supplier_id'
      ]
      Object.assign(staff, _.pick(this.props.staff, fields))
    }

    this.state = { ...staff, schoolList }
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

  handleNewTime = () => {
    const times = this.state.times.slice()
    times.push({
      start_time: '',
      end_time: ''
    })

    this.setState({ times })
  }

  handleRemoveTime = () => index => {
    const times = this.state.times.slice()
    times.splice(index, 1)
    this.setState({ times })
  }

  handleSave(e) {
    e.preventDefault()

    const { onSubmit } = this.props
    const staff = _.cloneDeep(this.state)
    if (staff.event_type !== 'EVENT_SHIFT') {
      delete staff.supplier_id
    }
    delete staff.schoolList
    console.log(staff)
    staff.start_date = staff.start_date.substr(0, 10)
    staff.end_date = staff.end_date.substr(0, 10)
    staff.times.forEach(time => {
      time.start_time += ':00'
      time.end_time += ':00'
    })

    onSubmit(staff)
  }

  render() {
    const { saving, onRemove, staff } = this.props
    const { schoolList } = this.state
    const eventType = SHIFT_TYPES.find(x => x.id === this.state.event_type)

    return (
      <div className={styles.wrapper}>
        <h4 className={styles.addTitle}>
          {staff ? 'Edit' : 'Add'} {eventType.name}
        </h4>
        <Loading loading={saving}>
          <Form onSubmit={this.handleSave.bind(this)}>
            {this.state.event_type === 'EVENT_SHIFT' && (
              <Row>
                <Col>
                  <ConnectSelect
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
                onChange={this.handleChangeDate}
                required
              />
            </div>
            {this.state.times.map((time, index) => (
              <div className={styles.timeRow}>
                <ConnectInput
                  basic
                  name="start_time"
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

export default ShiftForm
