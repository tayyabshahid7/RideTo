import React, { Fragment } from 'react'
import Splash from './Splash'
import Section from './Section'
import styles from './styles.scss'
import Helmet from 'react-helmet'

import content from './content'

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
        {content.map(data => (
          <Section key={data.name} data={data} />
        ))}
      </div>
    </Fragment>
  )
}

export default GettingStarted
