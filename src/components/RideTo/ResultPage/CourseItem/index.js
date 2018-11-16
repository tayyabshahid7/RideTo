import React, { Component } from 'react'
import classnames from 'classnames'
import { UncontrolledTooltip } from 'reactstrap'
import styles from './styles.scss'
import StarsComponent from 'components/RideTo/StarsComponent'
import { IconArrowRight, IconInfo, IconDistance } from 'assets/icons'
import * as FeatureIcons from 'assets/icons/features'
import { getFeatureInfo } from 'services/course'

class CourseItem extends Component {
  handleDetailClick() {}

  highlightPinOnMap(event) {
    const idElement = event.currentTarget.id
    const pinWrapper = document.getElementById(`${idElement.substring(5)}`)
    if (pinWrapper) {
      const mapPin = pinWrapper.getElementsByTagName('svg')[0]
      mapPin.classList.remove(styles.mapPinHighlight)
      mapPin.classList.add(styles.mapPinHighlight)
    }
  }

  removeHighlight(event) {
    const idElement = event.currentTarget.id
    const pinWrapper = document.getElementById(`${idElement.substring(5)}`)
    if (pinWrapper) {
      const mapPin = pinWrapper.getElementsByTagName('svg')[0]
      mapPin.classList.remove(styles.mapPinHighlight)
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

  render() {
    const {
      course,
      className,
      handleDetailClick,
      handlePriceClick,
      handleReviewClick,
      unavaiableDate = false,
      id
    } = this.props
    return (
      <div
        id={id}
        onMouseEnter={this.highlightPinOnMap}
        onMouseLeave={this.removeHighlight}
        className={classnames(styles.container, className)}>
        <div className={styles.photo} onClick={() => handlePriceClick(course)}>
          <img src={course.image} className={styles.image} alt="logo" />
          <div className={classnames(styles.price, styles.priceMobile)}>
            <div>£{parseInt(course.price / 100.0, 10)}</div>
            <IconArrowRight className={styles.arrowIcon} />
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.upperSection}>
            <div className={styles.courseName}>
              {course.location_slug.replace('-', ' ')}
            </div>
            <div className={styles.place}>
              {course.place}, {course.postcode}
            </div>
            <div className={styles.icons}>
              {course.mciac_approved && this.renderIcon('mciac_approved')}
              {course.bike_hire && this.renderIcon('bike_hire')}
              {course.helmet_hire && this.renderIcon('helmet_hire')}
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
              className={styles.detail}>
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
        <div
          className={classnames(
            styles.price,
            unavaiableDate && styles.priceDateUnavailable
          )}
          onClick={() => handlePriceClick(course)}>
          <div>£{parseInt(course.price / 100.0, 10)}</div>
          <IconArrowRight className={styles.arrowIcon} />
        </div>
      </div>
    )
  }
}

export default CourseItem
