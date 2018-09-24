import React, { Component } from 'react'
import moment from 'moment'
import {
  UncontrolledDropdown,
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
import MapComponent from './MapComponent'
import SidePanel from 'components/RideTo/SidePanel'
import CourseDetailPanel from './CourseDetailPanel'
import DateSelectorModal from './DateSelectorModal'
import RideToButton from 'components/RideTo/Button'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import Loading from 'components/Loading'
import { IconCalendar } from 'assets/icons'

class ResultPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedCourse: null,
      loading: false,
      showDateSelectorModal: false
    }
  }

  handleDetailClick(course) {
    this.setState({ selectedCourse: course })
  }

  onSelectDate(date) {
    const { handleSetDate } = this.props
    handleSetDate(date)
    this.setState({ showDateSelectorModal: false })
  }

  renderSortByDropdown() {
    const { handeUpdateOption, sortByOption } = this.props
    return (
      <UncontrolledDropdown>
        <DropdownToggle caret color="lightgrey" className={styles.sortButton}>
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
      </UncontrolledDropdown>
    )
  }

  renderMobileDateSelectorButton() {
    const { date } = this.props

    return (
      <div
        className={styles.dateSelectorMobile}
        onClick={() => this.setState({ showDateSelectorModal: true })}>
        <span>{moment(date).format(DAY_FORMAT5)}</span>
        <span>
          <IconCalendar />
        </span>
      </div>
    )
  }

  render() {
    const {
      courses,
      courseType,
      location,
      date,
      handleSetDate,
      navigation,
      handleNavClick,
      loading,
      userLocation
    } = this.props
    const { selectedCourse, showDateSelectorModal } = this.state
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
        <div className={styles.mobileButtons}>
          {this.renderMobileDateSelectorButton()}
          {this.renderSortByDropdown()}
        </div>
        <Loading loading={loading} className={styles.contentWrapper}>
          {/* <div className={styles.contentWrapper}> */}
          <div className={styles.mainContent}>
            <div className={styles.coursesPanel}>
              <div
                className={
                  styles.subTitle
                }>{`${courseType} in ${location} on ${moment(date).format(
                DAY_FORMAT5
              )}`}</div>
              {courses.map(course => (
                <CourseItem
                  course={course}
                  className="mt-3"
                  key={course.id}
                  handleDetailClick={this.handleDetailClick.bind(this)}
                />
              ))}
            </div>
            <div className={styles.mapPanel}>
              <div className={styles.buttonsWrapper}>
                {this.renderSortByDropdown()}
              </div>
              {courses.length > 0 && (
                <MapComponent
                  className={styles.mapWrapper}
                  courses={courses}
                  userLocation={userLocation}
                />
              )}
            </div>
          </div>
          {/* </div> */}
        </Loading>
        <SidePanel
          className={styles.noPadding}
          visible={selectedCourse !== null}
          headingImage={selectedCourse ? selectedCourse.image : ''}
          onDismiss={() => this.setState({ selectedCourse: null })}
          footer={
            <RideToButton className={styles.action}>
              <span>Book Now</span>
              <img src={ButtonArrowWhite} alt="arrow" />
            </RideToButton>
          }>
          {selectedCourse && (
            <CourseDetailPanel
              course={selectedCourse}
              userLocation={userLocation}
            />
          )}
        </SidePanel>
        {showDateSelectorModal && (
          <DateSelectorModal
            isOpen={true}
            onClose={() => this.setState({ showDateSelectorModal: false })}
            date={date}
            onSelect={this.onSelectDate.bind(this)}
          />
        )}
      </div>
    )
  }
}

export default ResultPage
