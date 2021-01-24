import React, { useRef } from 'react'
import classnames from 'classnames'
import styles from './SupplierInfo.scss'
import { IconPlace, IconTram } from 'assets/icons'
import * as FeatureIcons from 'assets/icons/features'
import IconText from '../IconText'
import { getFeatureInfo } from 'services/course'
import { UncontrolledTooltip } from 'reactstrap'
import StarsComponent from 'components/RideTo/StarsComponent'
import ReviewsBarComponent from 'components/RideTo/ReviewsBarComponent'

const supplier = window.RIDETO_PAGE.supplier.supplier
const ratings = supplier.ratings ? supplier.ratings : []

const SupplierInfo = () => {
  const backdrop = useRef()

  const handleReviewClick = () => {}

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
    indoor_classroom: true,
    instant_book: true
  }

  const validFeatures = Object.keys(feature).filter(x => supplier[x])

  const isFullLicence = false

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.logo}>
          <img
            src="/static/client/assets/corporate/bmf.png"
            alt="Supplier Logo"
          />
        </div>
        <h1>{supplier.name}</h1>
        <IconText
          icon={<IconPlace />}
          text={supplier.address_2 + ', ' + supplier.postcode}
          underlined
        />
        <IconText icon={<IconTram />} text="Fieldway Tramp stop" />
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
              rating={4}
              className={styles.starComponent}
              onClick={() => handleReviewClick()}
            />
            <span
              onClick={() => handleReviewClick()}
              className={styles.reviewCount}>
              {ratings.length}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.backdropArea}>
        <div ref={backdrop} className={styles.backdrop}></div>

        <div className={styles.aboutContainer} id="rideto-supplier-about">
          <h4 className={styles.blockTitle}>About {supplier.name}</h4>
          <div className={styles.aboutLines}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae
              leo pulvinar, consectetur augue blandit, ullamcorper orci.
              Curabitur eget sollicitudin lectus, quis auctor neque. Proin
              mauris lorem, vulputate sit amet nisl nec, consequat euismod
              neque. Integer feugiat molestie eros vel rhoncus. Maecenas nec ex
              a elit aliquet luctus sit amet nec velit. Sed purus erat, pulvinar
              et felis blandit, accumsan sagittis ligula.
            </p>
            <p>
              Nullam cursus pulvinar augue, consequat tristique neque convallis
              non. Aliquam nec finibus est, at gravida nisi. Suspendisse
              pharetra sollicitudin tristique. Aliquam scelerisque finibus quam
              quis iaculis. Phasellus blandit porttitor massa nec aliquet. Nunc
              in nunc id sapien suscipit porttitor.
            </p>
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
          <div className={styles.facilityImages}>
            <img src="https://via.placeholder.com/262x193" alt="Facility" />
            <img src="https://via.placeholder.com/262x193" alt="Facility" />
            <img src="https://via.placeholder.com/262x193" alt="Facility" />
            <img src="https://via.placeholder.com/262x193" alt="Facility" />
          </div>
        </div>

        <div className={styles.block}>
          <h4 className={classnames(styles.blockTitle, styles.margin20)}>
            LOCATION
          </h4>
          <div className={styles.aboutLines}>
            <p>
              Phoenix Motorcycle Training in Crystal Palace is a long
              established motorcycle CBT school in South London. They offer a
              large choice of bikes to train on, as well as providing jackets,
              boots, helmets and gloves as standard. There's an indoor class
              room for breaks and are just a 2 minute walk from the train
              station. The local roads are quiet and provide a variety of
              scenarios for learner riders. Phoenix are the UK's 1st MCIAC Gold
              Standard School providing the highest standard of motorcycle
              training.
            </p>
          </div>
          <div className={styles.locationIcon}>
            <IconText
              icon={<IconPlace />}
              text={supplier.address_2 + ', ' + supplier.postcode}
            />
          </div>
          TODO: MAP HERE
        </div>

        <div id="rideto-supplier-reviews">
          <h4 className={styles.blockTitle}>{ratings.length} REVIEWS</h4>
          <ReviewsBarComponent />
        </div>
      </div>
    </div>
  )
}

export default SupplierInfo
