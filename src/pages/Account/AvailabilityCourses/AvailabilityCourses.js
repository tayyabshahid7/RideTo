import React, { Fragment } from 'react'
import { Button } from 'components/ConnectForm'
import moment from 'moment'
import styles from './styles.scss'
import CreateBulkCourse from 'components/Account/CreateBulkCourse'
import classnames from 'classnames'
import CalendarLabels from './CalendarLabels'

class AvailabilityCourses extends React.Component {
  constructor(props) {
    super(props)
    let available_days = ['T', 'T', 'T', 'T', 'T', 'F', 'F']
    if (this.props.settings.default_open_days) {
      available_days = this.props.settings.default_open_days.split('')
    }
    this.state = {
      showCreateBulkCourseForm: false,
      available_days
    }
    this.handleAvailableDaysChange = this.handleAvailableDaysChange.bind(this)
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
    const { updateSettings, settings } = this.props
    const { available_days } = this.state
    updateSettings({ ...settings, default_open_days: available_days.join('') })
  }

  handleCreateBulkCourse(data) {
    const { createBulkCourse, schoolId } = this.props
    createBulkCourse({ schoolId, data })
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
    const { settingsSaving } = this.props
    return (
      <div className={styles.defaultDays}>
        <div className={styles.topRow}>
          <div>
            <div className={styles.title}>Default Days</div>
            <div>
              Set default days for when you run courses. Untick days you are not
              open
            </div>
          </div>
          <div>
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
      updateSettings
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
          />
        </div>
      </Fragment>
    )
  }
}

export default AvailabilityCourses
