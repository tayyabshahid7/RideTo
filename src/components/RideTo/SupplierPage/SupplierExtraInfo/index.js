import React from 'react'
import classnames from 'classnames'
import styles from './SupplierExtraInfo.scss'
import { SupplierContext } from '../supplier-context'
import SupplierCourseImageSlider from '../SupplierCourseImageSlider'
import SupplierCourseDetail from '../SupplierCourseDetail'
import { IconGuarantee } from 'assets/icons'
import { useMediaQuery } from 'react-responsive'

const SupplierExtraInfo = ({ course }) => {
  const { courseTypes } = React.useContext(SupplierContext)
  const isDesktop = useMediaQuery({ minWidth: 1200 })

  return (
    <React.Fragment>
      {isDesktop && (
        <div id="supplier-course-slider" className={styles.imageSlider}>
          <SupplierCourseImageSlider />
        </div>
      )}
      <div className={classnames(styles.container, styles.courseContainer)}>
        <SupplierCourseDetail courseTypes={courseTypes} course={course} />
      </div>
      <div className={styles.container}>
        <div className={styles.moneybackContent}>
          <div className={styles.moneybackIcon}>
            <IconGuarantee />
          </div>
          <div>
            <p>Cancel with 3 working days notice to get a full refund.</p>
            <a
              href="https://www.rideto.com/terms#cancellations"
              className={styles.link}>
              More Details
            </a>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <h4 className={styles.blockTitle}>the rideto difference</h4>
        <div className={styles.diffBlock}>
          <h6>Get Started Faster</h6>
          <p>
            With more schools than anywhere else, you can be on two wheels
            sooner than you think.
          </p>
        </div>
        <div className={styles.diffBlock}>
          <h6>top rated schools</h6>
          <p>
            We’ve hand-picked the top motorcycle schools based on learner
            feedback. Only the best stay on our platform.
          </p>
        </div>
        <div className={styles.diffBlock}>
          <h6>best prices</h6>
          <p>
            With our price match guarantee and discounts for new riders, we make
            learning to ride fun and affordable.
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SupplierExtraInfo
