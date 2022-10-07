import { IconArrowRight, IconDistance, IconInfo } from 'assets/icons'
import * as FeatureIcons from 'assets/icons/features'
import RideToSlider from 'components/RideToSlider'
import React, { Component, Fragment } from 'react'
import { parseQueryString } from 'services/api'
import { getFeatureInfo, getMediumCourseType } from 'services/course'
import AvailableDateBox from './AvailableDateBox'

import classnames from 'classnames'
import CallUsCard from 'components/RideTo/ResultPage/CallUsCard'
import POMCard from 'components/RideTo/ResultPage/POMCard'
import StarsComponent from 'components/RideTo/StarsComponent'
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

  nextDateAvailableClicked = (course, date) => {
    this.handleScroll()
    this.props.handleNextAvailableClick(course, date)
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

    const settings = {
      dots: false,
      infinite: false,
      arrows: false,
      speed: 500,
      slidesToShow: 4,
      className: styles.slider,
      swipeToSlide: true,

      responsive: [
        {
          breakpoint: 460,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 354,
          settings: {
            slidesToShow: 2.8
          }
        },
        {
          breakpoint: 300,
          settings: {
            slidesToShow: 2.5
          }
        }
      ]
    }

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
            onClick={() => this.detailClicked(course)}>
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
                    onClick={() => this.detailClicked(course)}>
                    {course.location_slug.replace('-', ' ')}
                  </button>
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
                onClick={() => this.detailClicked(course)}>
                {course.place}, {course.postcode}
              </div>
              <div className={styles.icons}>
                {course.mciac_approved && this.renderIcon('mciac_approved')}
                {course.bike_hire && this.renderIcon('bike_hire')}
                {course.helmet_hire && this.renderIcon('helmet_hire')}
                {course.gloves_jacket_included &&
                  this.renderIcon('gloves_jacket_included')}
                {course.on_site_cafe && this.renderIcon('on_site_cafe')}
                {course.on_site_parking && this.renderIcon('on_site_parking')}
                {course.indoor_classroom && this.renderIcon('indoor_classroom')}
                {!isFullLicence &&
                  course.instant_book &&
                  this.renderIcon('instant_book')}
              </div>
            </div>
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
                      <p className={styles.availabilityText}>Availability</p>
                      <div className={classnames(styles.wrap)}>
                        <RideToSlider settings={settings}>
                          {availableDates.map((item, index) => {
                            const { date, time, price } = item
                            return (
                              <AvailableDateBox
                                key={index}
                                index={index}
                                date={date}
                                time={time}
                                price={price}
                                arrSize={availableDates.length}
                                onClick={() =>
                                  this.nextDateAvailableClicked(course, date)
                                }
                                moreDatesOnClick={() =>
                                  this.priceClicked(course, date)
                                }
                              />
                            )
                          })}
                        </RideToSlider>
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
