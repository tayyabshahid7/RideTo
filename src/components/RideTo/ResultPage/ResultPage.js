import React, { Component } from 'react'
import moment from 'moment'
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { DAY_FORMAT5 } from 'common/constants'
import { SortByOptions, getTitleFor } from 'common/info'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import styles from './ResultPage.scss'
import DateSelector from './DateSelector'
import CourseItem from './CourseItem'
// import MapComponent from './MapComponent'

class ResultPage extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      dropdownOpen: false
    }
  }

  componentDidMount() {
    this.loadData()
  }

  componentDidUpdate(prevProps, prevState) {
    const { date } = this.props
    if (date !== prevProps.date) {
      this.loadData()
    }
  }

  loadData() {
    this.loadCourses()
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  loadCourses() {
    // const { getCourses, schoolId, calendar } = this.props
    // const { firstDate, lastDate } = this.getFirstAndLastDate(calendar)
    // getCourses({
    //   schoolId,
    //   firstDate: moment(firstDate).format(DATE_FORMAT),
    //   lastDate: moment(lastDate).format(DATE_FORMAT)
    // })
  }

  render() {
    const {
      courses,
      courseType,
      location,
      date,
      handleSetDate,
      handeUpdateOption,
      sortByOption,
      navigation,
      handleNavClick
    } = this.props
    const { dropdownOpen } = this.state
    return (
      <div className={styles.container}>
        <NavigationComponent
          navigation={navigation}
          onNavClick={handleNavClick}
        />
        <DateSelector
          date={date}
          handleSetDate={handleSetDate}
          className={styles.dateSelector}
        />
        <div className={styles.contentWrapper}>
          <div className={styles.mainContent}>
            <div className={styles.coursesPanel}>
              <div
                className={
                  styles.subTitle
                }>{`${courseType} in ${location} on ${moment(date).format(
                DAY_FORMAT5
              )}`}</div>
              {courses.map(course => (
                <CourseItem course={course} className="mt-3" key={course.id} />
              ))}
            </div>
            <div className={styles.mapPanel}>
              <div className={styles.buttonsWrapper}>
                <ButtonDropdown isOpen={dropdownOpen} toggle={this.toggle}>
                  <DropdownToggle
                    caret
                    color="lightgrey"
                    className={styles.sortButton}>
                    {getTitleFor(SortByOptions, sortByOption).toUpperCase()}
                  </DropdownToggle>
                  <DropdownMenu>
                    {SortByOptions.map(sortOption => (
                      <DropdownItem
                        onClick={() =>
                          handeUpdateOption({ sortByOption: sortOption.value })
                        }
                        key={sortOption.value}>
                        {sortOption.title.toUpperCase()}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </ButtonDropdown>
              </div>
              <div className={styles.mapWrapper}>
                {/* <MapComponent courses={courses}/> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ResultPage
