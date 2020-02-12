import React, { useEffect } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'
import pomShield from 'assets/images/pom-shield.svg'

function POMCard() {
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
        <p className={styles.content}>
          Find out what the offer is and how it can be of benefit to you.
        </p>
        <a
          target={isDesktop ? undefined : '_blank'}
          id="results-page-take-quiz-now-button"
          href="https://rideto.typeform.com/to/XeXuVE"
          className={classnames(
            styles.button,
            isDesktop ? 'typeform-share' : undefined
          )}>
          Take quiz now
        </a>
      </div>
    </div>
  )
}

export default POMCard
