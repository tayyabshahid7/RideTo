import React, { useEffect } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import pomShield from 'assets/images/pom-shield.svg'
import MediaQuery from 'react-responsive'

function POMCard({ showCourseTypeInfo }) {
  const isDesktop = useMediaQuery({ minWidth: 768 })

  useEffect(() => {
    if (isDesktop) {
      import('utils/helper').then(({ loadTypeformScript }) => {
        loadTypeformScript()
      })
    }
  }, [isDesktop])

  return (
    <div className={styles.container}>
      <img
        src={pomShield}
        alt="pom shield icon"
        className={styles.headerIcon}
      />
      <div className={styles.contentWrapper}>
        <h3 className={styles.heading}>WHAT IS THE PEACE OF MIND POLICY?</h3>
        <MediaQuery query="(min-width:  769px)">
          <p className={styles.content}>
            Find out what the offer is and how it can be <br /> of benefit to
            you.
          </p>
        </MediaQuery>
        <MediaQuery query="(max-width: 768px)">
          <p className={styles.content}>
            Find out what the offer is and how it <br /> can be of benefit to
            you.
          </p>
        </MediaQuery>

        <button
          onClick={showCourseTypeInfo}
          className={classnames(styles.button)}>
          More Info
        </button>
      </div>
    </div>
  )
}

export default POMCard
