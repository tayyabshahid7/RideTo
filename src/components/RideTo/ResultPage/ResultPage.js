import React, { Component } from 'react'
import moment from 'moment'
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import classnames from 'classnames'
import { DAY_FORMAT5 } from 'common/constants'
import { SortByOptions, getTitleFor } from 'common/info'
import NavigationComponent from 'components/RideTo/NavigationComponent'
import styles from './ResultPage.scss'
import DateSelector from './DateSelector'
import CourseItem from './CourseItem'
import MapComponent from 'components/RideTo/MapComponent'
import CourseItemNonPartner from './CourseItemNonPartner'
import SidePanel from 'components/RideTo/SidePanel'
import CourseDetailPanel from './CourseDetailPanel'
import DateSelectorModal from './DateSelectorModal'
import RideToButton from 'components/RideTo/Button'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import Loading from 'components/Loading'
import { IconCalendar } from 'assets/icons'
import { getCourseTitle } from 'services/course'

class ResultPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedCourse: null,
      loading: false,
      showDateSelectorModal: false,
      initialTab: '1',
      instantCourse: null,
      instantDate: null,
      bike_hire: null
    }
    this.onBookNow = this.onBookNow.bind(this)
  }

  handleDetailClick(course) {
    this.setState({
      selectedCourse: course,
      initialTab: '1',
      instantDate: this.props.date
    })
  }

  handlePriceClick(course) {
    this.setState({
      selectedCourse: course,
      initialTab: '3',
      instantDate: this.props.date
    })
  }

  onSelectDate(date) {
    const { handleSetDate } = this.props
    handleSetDate(date)
    this.setState({ showDateSelectorModal: false })
  }

  onUpdate(data) {
    this.setState({ ...data })
  }

  onBookNow() {
    const { selectedCourse, instantCourse, instantDate, bike_hire } = this.state
    const { postcode, courseType } = this.props
    if (!selectedCourse) {
      return
    }
    if (selectedCourse.instant_book) {
      if (instantCourse) {
        window.location = `/course-addons/?postcode=${postcode}&courseType=${courseType}&bike_hire=${bike_hire}&courseId=${
          instantCourse.id
        }&supplierId=${selectedCourse.id}&date=${instantDate}`
      }
    } else {
      window.location = `/course-addons/?postcode=${postcode}&courseType=${courseType}&bike_hire=${bike_hire}&supplierId=${
        selectedCourse.id
      }&date=${instantDate}`
    }
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
      postcode,
      date,
      handleSetDate,
      navigation,
      loading,
      userLocation
    } = this.props
    const {
      selectedCourse,
      showDateSelectorModal,
      initialTab,
      instantCourse,
      instantDate,
      bike_hire
    } = this.state
    const courseTitle = getCourseTitle(courseType)

    let bookNowDisabled = false
    if (selectedCourse) {
      bookNowDisabled =
        (selectedCourse.instant_book && !instantCourse) || !bike_hire
    }

    return (
      <div className={styles.container}>
        <NavigationComponent navigation={navigation} />
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
          <div className={styles.mainContent}>
            <div className={styles.coursesPanel}>
              <div className={styles.subTitle}>
                {`${courseTitle} in ${postcode} on ${moment(date).format(
                  DAY_FORMAT5
                )}`}
              </div>
              {courses.map(
                course =>
                  course.is_partner ? (
                    <CourseItem
                      course={course}
                      className="mt-3"
                      key={course.id}
                      handleDetailClick={this.handleDetailClick.bind(this)}
                      handlePriceClick={this.handlePriceClick.bind(this)}
                    />
                  ) : (
                    <CourseItemNonPartner
                      course={course}
                      className="mt-3"
                      key={course.id}
                    />
                  )
              )}
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
        </Loading>
        <SidePanel
          className={styles.noPadding}
          visible={selectedCourse !== null}
          headingImage={selectedCourse ? selectedCourse.image : ''}
          onDismiss={() => this.setState({ selectedCourse: null })}
          footer={
            <RideToButton
              className={classnames(
                styles.action,
                bookNowDisabled && styles.bookNowDisabled
              )}
              onClick={() => !bookNowDisabled && this.onBookNow()}>
              <span>Book Now</span>
              <img src={ButtonArrowWhite} alt="arrow" />
            </RideToButton>
          }>
          {selectedCourse && (
            <CourseDetailPanel
              course={selectedCourse}
              initialTab={initialTab}
              date={date}
              instantCourse={instantCourse}
              instantDate={instantDate}
              bike_hire={bike_hire}
              onUpdate={this.onUpdate.bind(this)}
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
