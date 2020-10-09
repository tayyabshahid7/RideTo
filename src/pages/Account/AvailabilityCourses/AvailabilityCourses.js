import React, { Fragment } from 'react'
import moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import styles from './styles.scss'
import CreateBulkCourse from 'components/Account/CreateBulkCourse'
import classnames from 'classnames'
// import CalendarLabels from './CalendarLabels'
import SchoolSelect from 'components/SchoolSelect'
import { Button, ConnectReactSelect } from 'components/ConnectForm'
import Loading from 'components/Loading'
import DefaultBikes from './DefaultBikes'
import {
  getTestCentres,
  getDefaultTestCentres,
  setDefaultTestCentres
} from 'store/testCentre'

class AvailabilityCourses extends React.Component {
  constructor(props) {
    super(props)

    let available_days = ['T', 'T', 'T', 'T', 'T', 'F', 'F']
    if (this.props.defaultDays.days) {
      available_days = this.props.defaultDays.days.split('')
    }
    this.state = {
      showCreateBulkCourseForm: false,
      showDefaultTestCenterForm: false,
      defaultCentres: [],
      available_days
    }
    this.handleAvailableDaysChange = this.handleAvailableDaysChange.bind(this)
    this.handleSupplierChange = this.handleSupplierChange.bind(this)
  }

  componentDidMount() {
    this.props.getTestCentres()
    this.props.getDefaultTestCentres()
    this.filterTestCenters()
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.defaultDays.days, prevProps.defaultDays.days)) {
      this.setState({
        available_days: this.props.defaultDays.days.split('')
      })
    }

    if (
      this.props.savingDefaultCentres !== prevProps.savingDefaultCentres &&
      !this.props.savingDefaultCentres
    ) {
      this.setState({ showDefaultTestCenterForm: false })
    }

    if (
      this.props.defaultTestCentres.length !==
        prevProps.defaultTestCentres.length ||
      this.props.testCentres.length !== prevProps.testCentres.length
    ) {
      this.filterTestCenters()
    }
  }

  filterTestCenters = () => {
    const defaultCentres = this.props.testCentres.filter(x =>
      this.props.defaultTestCentres.includes(x.id)
    )
    this.setState({ defaultCentres })
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
    const { createBulkCourse } = this.props
    const { supplier: schoolId } = data.school_course
    createBulkCourse({ schoolId, data })
  }

  handleSupplierChange(schoolId, schoolName) {
    this.props.changeSchool(schoolId, schoolName)
  }

  handleDefaultCentreChange = values => {
    this.setState({ defaultCentres: values })
  }

  handleSaveDefaultCentres = () => {
    const { defaultCentres } = this.state
    const ids = defaultCentres ? defaultCentres.map(x => x.id) : []
    this.props.setDefaultTestCentres(ids)
  }

  renderCreateCourse() {
    return (
      <div className={styles.row}>
        <div className={styles.leftCol}>
          <h3 className={styles.title}>Bulk Create Course</h3>
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

  renderDefaultTestCenters() {
    const { testCentres, defaultTestCentres } = this.props
    const list = testCentres.filter(x => defaultTestCentres.includes(x.id))
    return (
      <div className={styles.row}>
        <div className={styles.leftCol}>
          <h3 className={styles.title}>Default Test Centres</h3>
          <div className={styles.list}>
            <ul>
              {list.map(item => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.rightCol}>
          <Button
            color="primary"
            onClick={() => this.setState({ showDefaultTestCenterForm: true })}>
            Edit
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
              id="btnSaveDefaultDays"
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
      instructors,
      // schoolId,
      schools,
      history,
      saving,
      error,
      testCentres,
      user,
      savingDefaultCentres
      // settings,
      // updateSettings,
      // editInstructor,
      // updateDiaryColor
    } = this.props

    const {
      showCreateBulkCourseForm,
      showDefaultTestCenterForm,
      defaultCentres,
      available_days
    } = this.state
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
              schools={schools}
              available_days={available_days}
              handleCancel={this.handleCancel.bind(this)}
              saving={saving}
              error={error}
            />
          )}
        </div>
        <div className={styles.box}>{this.renderDefaultDays()}</div>
        <div className={classnames(styles.box, styles.boxVertical)}>
          {this.renderDefaultTestCenters()}
          {showDefaultTestCenterForm && (
            <div className={styles.horzForm}>
              <ConnectReactSelect
                value={defaultCentres}
                onChange={this.handleDefaultCentreChange}
                options={testCentres}
                closeMenuOnSelect={false}
              />
              <Button
                color="primary"
                className="mb-4"
                onClick={this.handleSaveDefaultCentres}
                disabled={savingDefaultCentres}>
                Save
              </Button>
            </div>
          )}
        </div>
        {/* <div className={styles.box}>
          <CalendarLabels
            settings={settings}
            instructors={instructors}
            schoolId={schoolId}
            info={info}
            updateSettings={updateSettings}
            editInstructor={editInstructor}
            updateDiaryColor={updateDiaryColor}
          />
        </div> */}
        <div className={styles.box}>
          <DefaultBikes user={user} info={info} schools={schools} />
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    testCentres: state.testCentre.testCentres,
    defaultTestCentres: state.testCentre.defaultTestCentres,
    savingDefaultCentres: state.testCentre.saving
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getTestCentres,
      getDefaultTestCentres,
      setDefaultTestCentres
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailabilityCourses)
