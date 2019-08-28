import React from 'react'
import styles from './styles.scss'
import { useMediaQuery } from 'react-responsive'

// TODO: Will need to portal this above the header or something

function Welcome() {
  const isDesktop = useMediaQuery({ minWidth: 1025 })

  return (
    <div className={styles.container}>
      {isDesktop && (
        <span className={styles.infoCircle}>
          <i className="fa fa-info-circle"></i>
        </span>
      )}{' '}
      Welcome to your RideTo Dashboard, your journey to two wheels.{' '}
      <a className={styles.link} href="/">
        Set your password
      </a>{' '}
      and have a look around...
    </div>
  )
}

export default Welcome
