import { IconArrowRight, IconDistance, IconInfo } from 'assets/icons'
import * as FeatureIcons from 'assets/icons/features'
import InstantBookingIcon from 'assets/icons/IconInstantBookingWhite.svg'
import React, { Component, Fragment } from 'react'
import { parseQueryString } from 'services/api'
import { getFeatureInfo, getMediumCourseType } from 'services/course'
import AvailableDateBox from './AvailableDateBox'
import MoreDatesBox from './AvailableDateBox/moreDates'

import classnames from 'classnames'
import CallUsCard from 'components/RideTo/ResultPage/CallUsCard'
import POMCard from 'components/RideTo/ResultPage/POMCard'
import StarsComponent from 'components/RideTo/StarsComponent'
import YellowStarsComponent from 'components/RideTo/StarsYellowComponent'
import get from 'lodash/get'
import moment from 'moment'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { UncontrolledTooltip } from 'reactstrap'
import { loadTypeformScript } from 'utils/helper'
import { BankHolidayProvider } from '../StateProvider'
import styles from './styles.scss'

import { Desktop, Mobile } from 'common/breakpoints'

class CourseItem extends Component {
  highlightPinOnMap(event) {
    const idElement = event.currentTarget.id
    const pinWrapper = document.getElementById(`${idElement.substring(5)}`)
    if (pinWrapper) {
      const mapPin = pinWrapper.getElementsByTagName('svg')[0]
      mapPin.classList.remove(styles.mapPinHighlight)
      mapPin.classList.add(styles.mapPinHighlight)
      pinWrapper.parentElement.classList.add(styles.markerTop)
    }
  }

  removeHighlight(event) {
    const idElement = event.currentTarget.id
    const pinWrapper = document.getElementById(`${idElement.substring(5)}`)
    if (pinWrapper) {
      const mapPin = pinWrapper.getElementsByTagName('svg')[0]
      mapPin.classList.remove(styles.mapPinHighlight)
      pinWrapper.parentElement.classList.remove(styles.markerTop)
    }
  }

  renderIcon(feature) {
    const { course } = this.props
    let featureInfo = getFeatureInfo(feature)
    return (
      <div>
        <img
          src={FeatureIcons[featureInfo.icon]}
          alt="feature"
          id={`feature-icon-${course.id}-${feature}`}
        />
        <UncontrolledTooltip
          placement="top"
          target={`feature-icon-${course.id}-${feature}`}
          innerClassName={styles.tooltip}>
          <div className={styles.tooltipTitle}>{featureInfo.title}</div>
          <div className={styles.tooltipInfo}>{featureInfo.description}</div>
        </UncontrolledTooltip>
      </div>
    )
  }

  renderIconMobile(feature) {
    const { course } = this.props
    let featureInfo = getFeatureInfo(feature)
    return (
      <div className={styles.mobileIcon}>
        <img
          src={FeatureIcons[featureInfo.icon]}
          alt="feature"
          id={`feature-icon-${course.id}-${feature}`}
        />
        <span>{featureInfo.title}</span>
      </div>
    )
  }

  isFullLicenceTypeform({ price }) {
    const { courseType } = this.props

    return !+price && courseType === 'FULL_LICENCE'
  }

  handleScroll = () => {
    // localStorage.setItem('COURSE_INFO_SCROLL_Y', window.scrollY)
    // const isMobile = window.innerWidth < 768 || window.screen.width < 768
    // if (isMobile) {
    //   setTimeout(() => {
    //     window.scrollTo(0, 0)
    //   }, 50)
    // }
  }

  detailClicked = course => {
    this.handleScroll()
    this.props.handleDetailClick(course)
  }

  priceClicked = course => {
    this.handleScroll()
    this.props.handlePriceClick(course)
  }

  reviewClicked = course => {
    this.handleScroll()
    this.props.handleReviewClick(course)
  }

  nextDateAvailableClicked = (course, date = null) => {
    this.handleScroll()
    if (date) {
      this.props.handleNextAvailableClick(course, date)
    } else {
      this.props.handlePriceClick(course)
    }
  }

  checkBankHoliday = date => {
    const bankHoliday = get(this.props, 'context.bankHoliday', [])
    return bankHoliday.some(item => item.date === date)
  }

  getPriceData = () => {
    const { course } = this.props
    const date = course.date || moment().format('YYYY-MM-DD')
    const getDay = new Date(date).getDay()

    // If hour pricing is avaiable, use it
    const hourlyPricing = parseInt(
      get(course, 'supplier_pricing[0].hour_price', '')
    )
    if (hourlyPricing) return hourlyPricing

    // if its a bank holday
    if (this.checkBankHoliday(date)) {
      return parseInt(get(course, 'supplier_pricing[0].bank_holiday_price', ''))
    }

    // If the date is a week end
    if (getDay === 0 || getDay === 6) {
      return parseInt(get(course, 'supplier_pricing[0].weekend_price', ''))
    } else {
      // If the date is a week day
      return parseInt(get(course, 'supplier_pricing[0].weekday_price', ''))
    }
  }

  checkNextDayAvailable = () => {
    const { course, courseType } = this.props

    if (!course.next_date_available) {
      return null
    }

    const date = moment(course.next_date_available, 'YYYY-MM-DD')
    const todayDate = moment()

    if (courseType === 'FULL_LICENCE') {
      return null
    }
    if (todayDate.diff(date) >= 0) {
      return null
    }
    return date
  }

  render() {
    const {
      course,
      className,
      showCourseTypeInfo,
      unavaiableDate = false,
      id,
      showCallMessage,
      showPomMessage,
      courseType
    } = this.props

    const { next_9_available_dates: availableDates } = course

    const isTypeform = this.isFullLicenceTypeform(course)

    if (isTypeform) {
      loadTypeformScript()
    }

    const isFullLicence = courseType === 'FULL_LICENCE'

    const footer = isFullLicence ? styles.footer : styles.footerCBTCourse

    const qs = parseQueryString(window.location.search.slice(1))
    const dateQuery = moment(qs.date, 'YYYY-MM-DD', true)
    const selectedDate = dateQuery ? dateQuery.format('MMM D, YYYY') : ''

    return (
      <Fragment>
        <div
          id={id}
          onMouseEnter={this.highlightPinOnMap}
          onMouseLeave={this.removeHighlight}
          className={classnames(styles.container, className)}>
          <div
            className={styles.photo}
            onClick={() => this.priceClicked(course)}>
            <Mobile>
              {!isFullLicence && course.instant_book && (
                <div className={styles.mobileInstantBook}>
                  <img src={InstantBookingIcon} alt="" />
                  <span>Instant booking</span>
                </div>
              )}
            </Mobile>
            <LazyLoadImage
              src={course.image_thumbnail || course.image}
              className={styles.image}
              alt={`${getMediumCourseType({
                constant: courseType
              })} ${course.location_slug.replace('-', ' ')} Logo`}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.upperSection}>
              <div className={styles.nextDateContainer}>
                <div>
                  <button
                    className={styles.courseName}
                    onClick={() => this.priceClicked(course)}>
                    {course.location_slug.replace('-', ' ')}
                  </button>
                  <Mobile>
                    <span
                      className={styles.mobileDistance}
                      onClick={() => this.priceClicked(course)}>
                      {course.distance_miles.toFixed(2)}mi
                    </span>

                    <div className={styles.mobileStartContainer}>
                      <YellowStarsComponent
                        rating={course.rating}
                        className={styles.starComponent}
                        starClassName={styles.mobileStarComponent}
                        onClick={() => this.reviewClicked(course)}
                      />
                      <div onClick={() => this.reviewClicked(course)}>
                        <span>{course.number_of_reviews}</span>
                      </div>
                    </div>
                  </Mobile>
                </div>
                <Desktop>
                  {this.checkNextDayAvailable() && (
                    <div className={styles.nextDateDiv}>
                      <button
                        className={styles.nextDateAvailable}
                        onClick={() => this.priceClicked(course)}>
                        Next Available<span> Date</span> -{' '}
                        {moment(course.next_date_available).format('D MMM')}
                      </button>
                    </div>
                  )}
                </Desktop>
              </div>
              <div
                className={styles.place}
                onClick={() => this.priceClicked(course)}>
                {course.place}, {course.postcode}
              </div>
              <Desktop>
                <div className={styles.icons}>
                  {course.mciac_approved && this.renderIcon('mciac_approved')}
                  {course.bike_hire && this.renderIcon('bike_hire')}
                  {course.helmet_hire && this.renderIcon('helmet_hire')}
                  {course.gloves_jacket_included &&
                    this.renderIcon('gloves_jacket_included')}
                  {course.on_site_cafe && this.renderIcon('on_site_cafe')}
                  {course.on_site_parking && this.renderIcon('on_site_parking')}
                  {course.indoor_classroom &&
                    this.renderIcon('indoor_classroom')}
                  {!isFullLicence &&
                    course.instant_book &&
                    this.renderIcon('instant_book')}
                </div>
              </Desktop>
              <Mobile>
                <div
                  onClick={() => this.priceClicked(course)}
                  className={styles.iconsMobile}>
                  {course.bike_hire && this.renderIconMobile('bike_hire')}
                  {course.helmet_hire && this.renderIconMobile('helmet_hire')}
                  {course.gloves_jacket_included &&
                    this.renderIconMobile('gloves_jacket_included')}
                  {course.indoor_classroom &&
                    this.renderIconMobile('indoor_classroom')}
                  {course.on_site_cafe && this.renderIconMobile('on_site_cafe')}
                  {course.on_site_parking &&
                    this.renderIconMobile('on_site_parking')}
                  {!isFullLicence &&
                    course.instant_book &&
                    this.renderIconMobile('instant_book')}
                </div>
                <div className={styles.divider}></div>
              </Mobile>
            </div>
            <Desktop>
              <div
                className={classnames(
                  styles.extraInfo,
                  courseType !== 'FULL_LICENCE' && styles.extraInfoMobile
                )}>
                <div>
                  <IconDistance className={styles.mileIcon} />{' '}
                  {course.distance_miles.toFixed(2)}
                  mi
                </div>
                <div>
                  <IconInfo className={styles.detailIcon} />{' '}
                  <span
                    onClick={() => this.detailClicked(course)}
                    className={classnames(styles.detail, styles.detailsLink)}>
                    Details
                  </span>
                </div>
                <div>
                  <StarsComponent
                    rating={course.rating}
                    className={styles.starComponent}
                    onClick={() => this.reviewClicked(course)}
                  />
                  <span
                    onClick={() => this.reviewClicked(course)}
                    className={styles.detail}>
                    {course.number_of_reviews}
                  </span>
                </div>
              </div>
            </Desktop>
          </div>
          <div className={footer}>
            {!isTypeform ? (
              <Fragment>
                <Desktop>
                  <div
                    className={styles.price}
                    onClick={() => this.priceClicked(course)}>
                    £{this.getPriceData()}
                    {courseType === 'FULL_LICENCE' && '/Hr'}
                  </div>
                  <div
                    className={classnames(
                      styles.cta,
                      unavaiableDate && styles.ctaDateUnavailable
                    )}
                    onClick={() => this.priceClicked(course)}>
                    <div>Select</div>
                    <IconArrowRight className={styles.arrowIcon} />
                  </div>
                </Desktop>
                <Mobile>
                  {courseType === 'FULL_LICENCE' && (
                    <Fragment>
                      <div
                        className={styles.price}
                        onClick={() => this.priceClicked(course)}>
                        £{this.getPriceData()}
                        {courseType === 'FULL_LICENCE' && '/Hr'}
                      </div>
                      <div
                        className={classnames(
                          styles.cta,
                          unavaiableDate && styles.ctaDateUnavailable
                        )}
                        onClick={() => this.priceClicked(course)}>
                        <div>Select</div>
                        <IconArrowRight className={styles.arrowIcon} />
                      </div>
                    </Fragment>
                  )}
                  {courseType !== 'FULL_LICENCE' && (
                    <Fragment>
                      <span className={styles.availabilityText}>
                        Availability
                      </span>
                      <div className={classnames(styles.wrap)}>
                        <div className={styles.outer}>
                          {availableDates.map((item, index) => {
                            const { date, time, price } = item
                            return (
                              <AvailableDateBox
                                key={index}
                                date={date}
                                time={time}
                                price={price}
                                onClick={() =>
                                  this.nextDateAvailableClicked(course, date)
                                }
                                moreDatesOnClick={() =>
                                  this.priceClicked(course, date)
                                }
                              />
                            )
                          })}
                          <MoreDatesBox
                            moreDatesOnClick={() => this.priceClicked(course)}
                          />
                        </div>
                      </div>
                      {unavaiableDate && selectedDate && (
                        <div className={styles.moreResults}>
                          <p>
                            There is no availability on {selectedDate} so we’ve
                            listed some dates above if you’re happy to be
                            flexible.
                          </p>
                        </div>
                      )}
                    </Fragment>
                  )}
                </Mobile>
              </Fragment>
            ) : (
              <a
                href="https://rideto.typeform.com/to/U9apGA"
                className={classnames(styles.cta, 'typeform-share')}>
                <div>Enquire</div>
                <IconArrowRight className={styles.arrowIcon} />
              </a>
            )}
          </div>
        </div>
        {showCallMessage && (
          <div
            className={classnames(styles.container, className, styles.callUs)}>
            <CallUsCard />
          </div>
        )}
        {showPomMessage && (
          <div className={classnames(styles.container, className, styles.pom)}>
            <POMCard showCourseTypeInfo={showCourseTypeInfo} />
          </div>
        )}
      </Fragment>
    )
  }
}

const withContext = Component => {
  return props => {
    return (
      <BankHolidayProvider.Consumer>
        {context => {
          return <Component {...props} context={context} />
        }}
      </BankHolidayProvider.Consumer>
    )
  }
}

export default withContext(CourseItem)
