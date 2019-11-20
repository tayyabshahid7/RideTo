import React, { Fragment } from 'react'
import { Button } from 'components/ConnectForm'
import moment from 'moment'
import styles from './styles.scss'
import CreateBulkCourse from 'components/Account/CreateBulkCourse'
import classnames from 'classnames'
import CalendarLabels from './CalendarLabels'
import SchoolSelect from 'components/SchoolSelect'
import isEqual from 'lodash/isEqual'
import Loading from 'components/Loading'

class AvailabilityCourses extends React.Component {
  constructor(props) {
    super(props)
    let available_days = ['T', 'T', 'T', 'T', 'T', 'F', 'F']
    if (this.props.defaultDays.days) {
      available_days = this.props.defaultDays.days.split('')
    }
    this.state = {
      showCreateBulkCourseForm: false,
      available_days
    }
    this.handleAvailableDaysChange = this.handleAvailableDaysChange.bind(this)
    this.handleSupplierChange = this.handleSupplierChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.defaultDays.days, prevProps.defaultDays.days)) {
      this.setState({
        available_days: this.props.defaultDays.days.split('')
      })
    }
  }

  handleAvailableDaysChange(index) {
    let { available_days } = this.state
    available_days[index] = available_days[index] === 'F' ? 'T' : 'F'
    this.setState({ available_days })
  }

  handleCancel() {
    this.setState({ showCreateBulkCourseForm: false })
  }

  handleSaveDefaultDays() {
    const { updateDefaultDays, schoolId } = this.props
    const { available_days } = this.state
    updateDefaultDays({ default_open_days: available_days.join('') }, schoolId)
  }

  handleCreateBulkCourse(data) {
    const { createBulkCourse, schoolId } = this.props
    createBulkCourse({ schoolId, data })
  }

  handleSupplierChange(schoolId, schoolName) {
    this.props.changeSchool(schoolId, schoolName)
  }

  renderCreateCourse() {
    return (
      <div className={styles.row}>
        <div className={styles.leftCol}>
          <h3 className={styles.title}>Bulk create course</h3>
          <div>
            Setup a mass number of courses in your calendar for any time range
          </div>
        </div>
        <div className={styles.rightCol}>
          <Button
            color="primary"
            onClick={() => this.setState({ showCreateBulkCourseForm: true })}>
            Bulk Create
          </Button>
        </div>
      </div>
    )
  }

  renderDefaultDays() {
    const { available_days } = this.state
    const { settingsSaving, user, schoolId, defaultDays } = this.props
    return (
      <Loading loading={defaultDays.loading}>
        <div className={styles.defaultDays}>
          <div className={styles.topRow}>
            <div>
              <div className={styles.title}>Default Days</div>
              <div>
                Set default days for when you run courses. Untick days you are
                not open
              </div>
            </div>
            <div>
              <div className={styles.select}>
                <SchoolSelect
                  schools={user.suppliers}
                  selected={schoolId}
                  onChange={this.handleSupplierChange}
                  small
                />
              </div>
              {available_days.map((day, index) => (
                <div
                  key={index}
                  className={styles.defaultDayRow}
                  onClick={() => this.handleAvailableDaysChange(index)}>
                  <div className="col-6">
                    {`${moment()
                      .isoWeekday(index + 1)
                      .format('dddd')}`}
                    :
                  </div>
                  <div className="col-6">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id={`customCheck${index}`}
                        checked={day !== 'F'}
                        readOnly
                      />
                      <label
                        className={`custom-control-label ${
                          day === 'F' ? '' : 'text-white'
                        }`}>
                        {day === 'F' ? 'Closed' : 'Open'}
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.bottomRow}>
            <Button
              color="primary mt-2"
              onClick={this.handleSaveDefaultDays.bind(this)}
              disabled={settingsSaving}>
              Save
            </Button>
          </div>
        </div>
      </Loading>
    )
  }

  render() {
    const {
      info,
      loadCourseTypes,
      instructors,
      schoolId,
      schools,
      getInstructors,
      history,
      saving,
      error,
      settings,
      updateSettings,
      editInstructor,
      updateDiaryColor
    } = this.props
    const { showCreateBulkCourseForm, available_days } = this.state
    return (
      <Fragment>
        <div className={classnames(styles.box, styles.boxVertical)}>
          {this.renderCreateCourse()}
          {showCreateBulkCourseForm && (
            <CreateBulkCourse
              onSubmit={this.handleCreateBulkCourse.bind(this)}
              info={info}
              history={history}
              instructors={instructors}
              loadCourseTypes={loadCourseTypes}
              schoolId={schoolId}
              schools={schools}
              getInstructors={getInstructors}
              available_days={available_days}
              handleCancel={this.handleCancel.bind(this)}
              saving={saving}
              error={error}
            />
          )}
        </div>
        <div className={styles.box}>{this.renderDefaultDays()}</div>
        <div className={styles.box}>
          <CalendarLabels
            settings={settings}
            instructors={instructors}
            getInstructors={getInstructors}
            schoolId={schoolId}
            info={info}
            loadCourseTypes={loadCourseTypes}
            updateSettings={updateSettings}
            editInstructor={editInstructor}
            updateDiaryColor={updateDiaryColor}
          />
        </div>
      </Fragment>
    )
  }
}

export default AvailabilityCourses
