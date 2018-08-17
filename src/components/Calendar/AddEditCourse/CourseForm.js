import React from 'react'
import moment from 'moment'
import { Button, Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import InputTextGroup from 'components/Forms/InputTextGroup'
import InputSelectGroup from 'components/Forms/InputSelectGroup'
import { DAY_FORMAT2 } from 'common/constants'
import Loading from 'components/Loading'
import pick from 'lodash/pick'

class CourseForm extends React.Component {
  constructor(props) {
    super(props)
    const course = {
      course_type_id: '',
      date: '',
      time: '',
      spaces: '',
      duration: '',
      auto_bikes: '',
      manual_bikes: ''
    }
    if (this.props.course) {
      Object.assign(
        course,
        pick(
          this.props.course,
          'date',
          'time',
          'spaces',
          'duration',
          'auto_bikes',
          'manual_bikes'
        )
      )
      course.course_type_id =
        typeof this.props.course.course_type === 'string'
          ? this.props.course.course_type
          : this.props.course.course_type.id
    } else if (this.props.date) {
      course.date = this.props.date
    }
    this.state = {
      course: course
    }
  }

  componentDidMount() {
    if (
      !this.props.info.courseTypes ||
      this.props.info.courseTypes.length === 0
    ) {
      this.props.loadCourseTypes({ schoolId: this.props.schoolId })
    }
  }

  handleChangeRawEvent(event) {
    let name = event.target.name
    let { course } = this.state
    course[name] = event.target.value
    this.setState({ course })
  }

  handleCancel(event) {
    event.preventDefault()
    const { date, history, course } = this.props
    if (date) {
      history.push(`/calendar/${date}`)
    } else if (course) {
      history.push(`/calendar/${course.date}`)
    } else {
      history.push(`/calendar`)
    }
  }

  handleSave(event) {
    const { onSubmit } = this.props
    const { course } = this.state
    event.preventDefault()
    onSubmit(course)
  }

  renderTitle() {
    const { course, date } = this.props
    let title = 'Add New Course'
    if (course) {
      title = moment(new Date(course.date)).format(DAY_FORMAT2)
    } else if (date) {
      title = moment(new Date(date)).format(DAY_FORMAT2)
    }
    return <h3>{title}</h3>
  }

  render() {
    let { info, saving } = this.props
    const {
      course_type_id,
      date,
      time,
      spaces,
      duration,
      auto_bikes,
      manual_bikes
    } = this.state.course
    return (
      <div className={styles.container}>
        {this.renderTitle()}
        <Loading loading={saving}>
          <Form onSubmit={this.handleSave.bind(this)}>
            <Row>
              <Col>
                <InputSelectGroup
                  name="course_type_id"
                  value={course_type_id}
                  label=""
                  valueArray={info.courseTypes.map(courseType => ({
                    value: courseType.id,
                    title: courseType.name
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
                  type="number"
                  onChange={this.handleChangeRawEvent.bind(this)}
                />
              </Col>
            </Row>
            <Row>
              {!this.props.course &&
                !this.props.date && (
                  <Col>
                    <InputTextGroup
                      name="date"
                      value={date}
                      label="Date"
                      className="form-group"
                      type="date"
                      onChange={this.handleChangeRawEvent.bind(this)}
                      required
                    />
                  </Col>
                )}
              <Col>
                <InputTextGroup
                  name="time"
                  value={time}
                  label="Start Time"
                  className="form-group"
                  type="time"
                  onChange={this.handleChangeRawEvent.bind(this)}
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

export default CourseForm
