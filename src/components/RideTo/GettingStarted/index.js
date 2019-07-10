import React, { Fragment } from 'react'
import Splash from './Splash'
import Section from './Section'
import styles from './styles.scss'
import Helmet from 'react-helmet'

function GettingStarted() {
  const scrollTo = id => {
    console.log(id)
  }

  return (
    <Fragment>
      <Helmet>
        <title>Rideto | Getting Started</title>
      </Helmet>
      <div className={styles.container}>
        <Splash scrollTo={scrollTo} />
        <Section />
      </div>
    </Fragment>
  )
}

export default GettingStarted
