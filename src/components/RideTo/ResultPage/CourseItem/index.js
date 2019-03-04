import React, { Component, Fragment } from 'react'
import classnames from 'classnames'
import { UncontrolledTooltip } from 'reactstrap'
import styles from './styles.scss'
import StarsComponent from 'components/RideTo/StarsComponent'
import { IconArrowRight, IconDistance, IconInfo } from 'assets/icons'
import * as FeatureIcons from 'assets/icons/features'
import { getFeatureInfo } from 'services/course'
import CallUsCard from 'components/RideTo/ResultPage/CallUsCard'

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

  isFullLicenceTypeform(course) {
    const { courseType } = this.props
    const { instant_book } = course

    if (courseType === 'FULL_LICENCE' && instant_book === false) {
      return true
    } else {
      return false
    }
  }

  render() {
    const {
      course,
      className,
      handleDetailClick,
      handlePriceClick,
      handleReviewClick,
      unavaiableDate = false,
      id,
      showCallMessage
    } = this.props
    return (
      <Fragment>
        <div
          id={id}
          onMouseEnter={this.highlightPinOnMap}
          onMouseLeave={this.removeHighlight}
          className={classnames(styles.container, className)}>
          <div
            className={styles.photo}
            onClick={() => handleDetailClick(course)}>
            <img src={course.image} className={styles.image} alt="logo" />
          </div>
          <div className={styles.info}>
            <div className={styles.upperSection}>
              <button
                className={styles.courseName}
                onClick={() => handleDetailClick(course)}>
                {course.location_slug.replace('-', ' ')}
              </button>
              <div className={styles.place}>
                {course.place}, {course.postcode}
              </div>
              <div className={styles.icons}>
                {course.mciac_approved && this.renderIcon('mciac_approved')}
                {course.bike_hire && this.renderIcon('bike_hire')}
                {course.helmet_hire && this.renderIcon('helmet_hire')}
                {course.gloves_jacket_included &&
                  this.renderIcon('gloves_jacket_included')}
                {course.on_site_cafe && this.renderIcon('on_site_cafe')}
                {course.indoor_classroom && this.renderIcon('indoor_classroom')}
                {course.instant_book && this.renderIcon('instant_book')}
              </div>
            </div>
            <div className={styles.extraInfo}>
              <IconDistance className={styles.mileIcon} />{' '}
              {course.distance_miles.toFixed(2)}
              mi
              <IconInfo className={styles.detailIcon} />{' '}
              <span
                onClick={() => handleDetailClick(course)}
                className={classnames(styles.detail, styles.detailsLink)}>
                Details
              </span>
              <StarsComponent
                rating={course.rating}
                className={styles.starComponent}
              />
              <span
                onClick={() => handleReviewClick(course)}
                className={styles.detail}>
                {course.number_of_reviews}
              </span>
            </div>
          </div>
          <div className={styles.footer}>
            {course.price && (
              <div className={styles.price}>
                £{parseInt(course.price / 100.0, 10)}
              </div>
            )}
            {this.isFullLicenceTypeform(course) ? (
              <a href="#" className={styles.cta}>
                <div>Enquire</div>
                <IconArrowRight className={styles.arrowIcon} />
              </a>
            ) : (
              <div
                className={classnames(
                  styles.cta,
                  unavaiableDate && styles.ctaDateUnavailable
                )}
                onClick={() => handlePriceClick(course)}>
                <div>Select</div>
                <IconArrowRight className={styles.arrowIcon} />
              </div>
            )}
          </div>
        </div>
        {showCallMessage && (
          <div
            className={classnames(styles.container, className, styles.callUs)}>
            <CallUsCard />
          </div>
        )}
      </Fragment>
    )
  }
}

export default CourseItem
