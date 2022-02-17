import * as FeatureIcons from 'assets/icons/features'

import { IconPlace, IconTram } from 'assets/icons'
import React, { useRef, useState } from 'react'

import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import IconText from '../IconText'
import MapComponent from 'components/RideTo/MapComponent'
import ReviewItem from 'components/RideTo/ReviewItem'
import ReviewsBarComponent from 'components/RideTo/ReviewsBarComponent'
import RideToButton from 'components/RideTo/Button'
import StarsComponent from 'components/RideTo/StarsComponent'
import SupplierCourseImageSlider from '../SupplierCourseImageSlider'
import { UncontrolledTooltip } from 'reactstrap'
import classnames from 'classnames'
import { getFeatureInfo } from 'services/course'
import styles from './SupplierInfo.scss'
import { useMediaQuery } from 'react-responsive'

const supplier = window.RIDETO_PAGE.supplier.supplier
const ratings = supplier.ratings ? supplier.ratings : []
const totalReviews = supplier.google_number_of_reviews
const googleRating = supplier.google_rating
const trampText = supplier.nearest_tube_station
supplier.lat = parseFloat(supplier.latitude)
supplier.lng = parseFloat(supplier.longitude)
supplier.instant_book = window.RIDETO_PAGE.supplier.instant_book

const supplierAddress = [
  supplier.address_1,
  supplier.address_2,
  supplier.town,
  supplier.postcode
]
  .filter(x => x)
  .join(', ')

const reviews = {
  '5 Star': 0,
  '4 Star': 0,
  '3 Star': 0,
  '2 Star': 0,
  '1 Star': 0
}

const SupplierInfo = ({ onShowExtra }) => {
  const [showCnt, setShowCnt] = useState(3)
  const isDesktop = useMediaQuery({ minWidth: 1200 })
  const backdrop = useRef()
  const reviewBlock = useRef()
  const mapArea = useRef()

  const handleReviewClick = () => {
    reviewBlock.current.scrollIntoView({ behavior: 'smooth' })
  }

  const handleShowMore = () => {
    setShowCnt(showCnt + 5)
  }

  const handleShowMap = () => {
    mapArea.current.scrollIntoView({ behavior: 'smooth' })
  }

  const renderIcon = feature => {
    let featureInfo = getFeatureInfo(feature)
    return (
      <div>
        <img
          src={FeatureIcons[featureInfo.icon]}
          alt="feature"
          id={`supplier-features-${feature}`}
        />
        <UncontrolledTooltip
          placement="top"
          target={`supplier-features-${feature}`}
          innerClassName={styles.tooltip}>
          <div className={styles.tooltipTitle}>{featureInfo.title}</div>
          <div className={styles.tooltipInfo}>{featureInfo.description}</div>
        </UncontrolledTooltip>
      </div>
    )
  }

  const feature = {
    mciac_approved: true,
    bike_hire: true,
    helmet_hire: true,
    gloves_jacket_included: true,
    on_site_cafe: true,
    on_site_parking: true,
    indoor_classroom: true
  }

  const validFeatures = Object.keys(feature).filter(x => supplier[x])

  const isFullLicence = false

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.logo}>
          <img src={supplier.hosted_logo} alt="Supplier Logo" />
        </div>
        <h1>{supplier.name}</h1>
        <div onClick={handleShowMap}>
          <IconText icon={<IconPlace />} text={supplierAddress} underlined />
        </div>
        {!!trampText && <IconText icon={<IconTram />} text={trampText} />}
        <hr />
        <div className={styles.iconsReviews}>
          <div className={styles.icons}>
            {supplier.mciac_approved && renderIcon('mciac_approved')}
            {supplier.bike_hire && renderIcon('bike_hire')}
            {supplier.helmet_hire && renderIcon('helmet_hire')}
            {supplier.gloves_jacket_included &&
              renderIcon('gloves_jacket_included')}
            {supplier.on_site_cafe && renderIcon('on_site_cafe')}
            {supplier.on_site_parking && renderIcon('on_site_parking')}
            {supplier.indoor_classroom && renderIcon('indoor_classroom')}
            {!isFullLicence &&
              supplier.instant_book &&
              renderIcon('instant_book')}
          </div>
          <div className={styles.reviews}>
            <StarsComponent
              rating={googleRating}
              className={styles.starComponent}
              onClick={() => handleReviewClick()}
            />
            <span
              onClick={() => handleReviewClick()}
              className={styles.reviewCount}>
              {totalReviews}
            </span>
          </div>
        </div>
        {!isDesktop && (
          <RideToButton
            className={styles.actionButton}
            onClick={() => onShowExtra()}>
            <span>Check Availability</span>
            <img src={ButtonArrowWhite} alt="arrow" />
          </RideToButton>
        )}
      </div>
      {!isDesktop && (
        <div className={styles.imageSlider}>
          <SupplierCourseImageSlider />
        </div>
      )}

      <div className={styles.backdropArea}>
        <div ref={backdrop} className={styles.backdrop}></div>

        <div className={styles.aboutContainer} id="rideto-supplier-about">
          <h2 className={styles.blockTitle}>About {supplier.name}</h2>
          <div className={styles.aboutLines}>
            <p>{supplier.rideto_opinion}</p>
          </div>
        </div>

        <div className={styles.block}>
          <h4 className={classnames(styles.blockTitle, styles.margin20)}>
            FACILITIES
          </h4>
          <div className={styles.facilityGroup}>
            {validFeatures.map(item => {
              const featureInfo = getFeatureInfo(item)
              return (
                <IconText
                  key={item}
                  icon={
                    <img
                      src={FeatureIcons[featureInfo.icon]}
                      alt={featureInfo.title}
                    />
                  }
                  text={featureInfo.title}
                />
              )
            })}
          </div>
          {/* <div className={styles.facilityImages}>
            <img src="https://via.placeholder.com/262x193" alt="Facility" />
            <img src="https://via.placeholder.com/262x193" alt="Facility" />
            <img src="https://via.placeholder.com/262x193" alt="Facility" />
            <img src="https://via.placeholder.com/262x193" alt="Facility" />
          </div> */}
        </div>

        <div className={styles.block}>
          <h4 className={classnames(styles.blockTitle, styles.margin20)}>
            LOCATION
          </h4>
          <div className={styles.aboutLines}>
            <p>{supplier.location_information}</p>
          </div>
          <div ref={mapArea} className={styles.locationIcon}>
            <IconText icon={<IconPlace />} text={supplierAddress} />
          </div>
          <MapComponent
            className={styles.mapWrapper}
            courses={[supplier]}
            sidebar
          />
        </div>

        <div ref={reviewBlock} className={styles.reviewsBlock}>
          <h4 className={styles.blockTitle}>{totalReviews} REVIEWS</h4>
          <ReviewsBarComponent reviews={reviews} />
          <div className={styles.reviewList}>
            {ratings.slice(0, showCnt).map(rating => (
              <ReviewItem key={rating.id} {...rating} />
            ))}
          </div>
          {showCnt < ratings.length && (
            <span className={styles.loadButton} onClick={handleShowMore}>
              LOAD MORE
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupplierInfo
