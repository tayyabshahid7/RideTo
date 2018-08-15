import React from 'react'
import moment from 'moment'
import { Button, Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import InputTextGroup from 'components/Forms/InputTextGroup'
import InputSelectGroup from 'components/Forms/InputSelectGroup'
import { DAY_FORMAT1 } from 'common/constants'
import { BikeHires } from 'common/info'
import Loading from 'components/Loading'

class CourseForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      course: {
        supplier_id: '',
        course_type_id: '',
        date: '',
        time: '',
        spaces: '',
        duration: '',
        auto_bikes: '',
        manual_bikes: ''
      }
    }
  }

  componentDidMount() {
    if (
      !this.props.info.courseTypes ||
      this.props.info.courseTypes.lenght === 0
    ) {
      this.props.loadCourseTypes()
    }
  }

  handleChangeRawEvent(event) {
    let name = event.target.name
    let { course } = this.state
    course[name] = event.target.value
    this.setState({ course })
  }

  async handleSave(event) {
    const { onSave, onCancel } = this.props
    const { course } = this.state
    event.preventDefault()
    let response = await onSave(course)
    if (response) {
      // Then Success
      onCancel()
    }
  }

  renderTitle() {
    const { course, date } = this.props
    let title = 'Add New Course'
    if (course) {
      title = course.name
    } else if (date) {
      title = moment(new Date(date)).format(DAY_FORMAT1)
    }
    return <h3>{title}</h3>
  }

  render() {
    let { onCancel, info, schools, saving } = this.props
    const {
      supplier_id,
      course_type_id,
      date,
      time,
      spaces,
      duration,
      auto_bikes,
      manual_bikes
    } = this.state

    return (
      <div className={styles.container}>
        {this.renderTitle()}
        {/* <Loading loading={saving}> */}
        <Form onSubmit={this.handleSave.bind(this)}>
          <Row>
            <Col>
              <InputSelectGroup
                name="course_type_id"
                value={course_type_id}
                label=""
                valueArray={info.courseTypes}
                noSelectOption
                onChange={this.handleChangeRawEvent.bind(this)}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputSelectGroup
                name="supplier_id"
                value={supplier_id}
                label="Training Site"
                valueArray={schools.map(school => ({
                  value: school.id,
                  title: school.name
                }))}
                noSelectOption
                onChange={this.handleChangeRawEvent.bind(this)}
                required
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputTextGroup
                name="spaces"
                value={spaces}
                label="Spaces"
                className="form-group"
                type="number"
                onChange={this.handleChangeRawEvent.bind(this)}
                required
              />
            </Col>
            <Col>
              <InputTextGroup
                name="auto_bikes"
                value={auto_bikes}
                label="Automatic"
                className="form-group"
                type="number"
                onChange={this.handleChangeRawEvent.bind(this)}
              />
            </Col>
            <Col>
              <InputTextGroup
                name="manual_bikes"
                value={manual_bikes}
                label="Manual"
                className="form-group"
                type="email"
                onChange={this.handleChangeRawEvent.bind(this)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputTextGroup
                name="time"
                value={time}
                label="Start Time"
                className="form-group"
                type="time"
                onChange={this.handleChangeRawEvent.bind(this)}
                // pattern="(1[0-2]|0[1-9])\/(1[5-9]|2\d)"
                required
              />
            </Col>
            <Col>
              <InputTextGroup
                name="duration"
                value={duration}
                label="Duration"
                className="form-group"
                type="number"
                onChange={this.handleChangeRawEvent.bind(this)}
                // pattern="(1[0-2]|0[1-9])\/(1[5-9]|2\d)"
                required
              />
            </Col>
          </Row>
          {/* <Row>
            <Col>
              <InputTextGroup
                name="trainer_id"
                value={trainer_id}
                label="Instructor"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent.bind(this)}
                required
              />
            </Col>
            <Col>
              <InputTextGroup
                name="price"
                value={price}
                label="Payout Per Booking"
                disabled
              />
            </Col>
          </Row> */}
          {/* <Row>
            <Col>
              <InputTextGroup
                name="notes"
                value={notes}
                label="Notes"
                type="textarea"
                onChange={this.handleChangeRawEvent.bind(this)}
                required
              />
            </Col>
          </Row> */}
          <Row>
            <Col className="mt-3 text-right">
              <Button type="submit" color="primary" className="mr-2">
                Save
              </Button>
              <Button color="" onClick={onCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
        {/* </Loading> */}
      </div>
    )
  }
}

export default CourseForm
