import React from 'react'
import moment from 'moment'
import { Button, Row, Col, Form } from 'reactstrap'
import styles from './styles.scss'
import InputTextGroup from 'components/Forms/InputTextGroup'
import InputSelectGroup from 'components/Forms/InputSelectGroup'
import Loading from 'components/Loading'

class CreateBulkCourse extends React.Component {
  constructor(props) {
    super(props)
    const course = {
      course_type_id: '',
      instructor_id: '',
      start_date: '',
      end_date: '',
      time: '',
      end_time: '',
      spaces: '',
      duration: '',
      notes: '',
      auto_bikes: '',
      manual_bikes: ''
    }

    this.state = {
      course: course,
      useDefaultDays: false
    }
  }

  componentDidMount() {
    const {
      getInstructors,
      info,
      instructors,
      loadCourseTypes,
      schoolId
    } = this.props
    if (!info.courseTypes || info.courseTypes.length === 0) {
      loadCourseTypes({ schoolId: schoolId })
    }
    if (!instructors || instructors.length === 0) {
      getInstructors(schoolId)
    }
  }

  componentDidUpdate(prevProps) {
    const { saving, error, history } = this.props
    if (prevProps.saving && !saving) {
      if (error) {
        alert('Failed to create bulk course')
      } else {
        const { start_date } = this.state.course
        history.push(`/calendar/${start_date}`)
      }
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
    const { handleCancel } = this.props
    handleCancel()
  }

  handleSave(event) {
    event.preventDefault()
    const { onSubmit, available_days, schoolId } = this.props
    const {
      course_type_id,
      instructor_id,
      time,
      spaces,
      start_date,
      end_date,
      end_time,
      notes,
      auto_bikes,
      manual_bikes
    } = this.state.course

    let repeat = {
      start_date,
      end_date,
      available_days: available_days.join(''),
      supplier: schoolId.toString()
    }
    let duration = moment(`2000-01-01 ${end_time}`).diff(
      moment(`2000-01-01 ${time}`),
      'minutes'
    )
    if (duration < 0) {
      return
    }
    if (start_date > end_date) {
      return
    }
    let school_course = {
      course_type_id,
      instructor_id,
      time,
      spaces,
      auto_bikes,
      manual_bikes,
      notes,
      duration: duration.toString(),
      supplier: schoolId.toString(),
      date: start_date
    }
    onSubmit({ school_course, repeat })
  }

  render() {
    let { info, saving, instructors } = this.props
    const {
      course_type_id,
      instructor_id,
      time,
      spaces,
      start_date,
      end_date,
      end_time,
      notes,
      auto_bikes,
      manual_bikes
    } = this.state.course
    return (
      <div className={styles.container}>
        <div className={styles.title}>Create default course</div>
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
              <Col>
                <InputTextGroup
                  name="start_date"
                  value={start_date}
                  label="Start Date"
                  className="form-group"
                  type="date"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
                />
              </Col>
              <Col>
                <InputTextGroup
                  name="end_date"
                  value={end_date}
                  label="End Date"
                  className="form-group"
                  type="date"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
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
                  required
                />
              </Col>
              <Col>
                <InputTextGroup
                  name="end_time"
                  value={end_time}
                  label="Finish Time"
                  className="form-group"
                  type="time"
                  onChange={this.handleChangeRawEvent.bind(this)}
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <InputSelectGroup
                  name="instructor_id"
                  value={instructor_id}
                  label="Instructor"
                  valueArray={instructors.map(instructor => ({
                    value: instructor.id,
                    title: `${instructor.first_name} ${instructor.last_name}`
                  }))}
                  noSelectOption
                  onChange={this.handleChangeRawEvent.bind(this)}
                />
              </Col>
              {/* <Col>
                <InputTextGroup
                  name="price"
                  value={
                    pricing.loading
                      ? '...'
                      : pricing.info
                        ? `£${(pricing.info.payout / 100.0).toFixed(2)}`
                        : ''
                  }
                  label="Payout Per Booking"
                  disabled
                />
              </Col> */}
            </Row>
            <Row>
              <Col>
                <InputTextGroup
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

export default CreateBulkCourse
