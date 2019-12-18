import React, { useEffect } from 'react'
import styles from './styles.scss'
import classnames from 'classnames'
import { useMediaQuery } from 'react-responsive'

function CallUsCard() {
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
      <h3 className={styles.heading}>Unsure where to start?</h3>
      <p className={styles.content}>
        Find out what licence and course is right for you.
      </p>
      <a
        target={isDesktop ? undefined : '_blank'}
        href="https://rideto.typeform.com/to/XeXuVE"
        className={classnames(
          styles.button,
          isDesktop ? 'typeform-share' : undefined
        )}>
        Take quiz now
      </a>
    </div>
  )
}

export default CallUsCard
