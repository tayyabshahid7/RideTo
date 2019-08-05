import React from 'react'
import styles from './styles.scss'

// TODO: Will need to portal this above the header or something

function Welcome() {
  return (
    <div className={styles.container}>
      Welcome to your RideTo Dashboard, your journey to two wheels.{' '}
      <a href="/">Set your password</a> and have a look around...
    </div>
  )
}

export default Welcome
