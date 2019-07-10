import React, { Fragment, useState } from 'react'
import { Waypoint } from 'react-waypoint'
import Splash from './Splash'
import Menu from './Menu'
import Section from './Section'
import styles from './styles.scss'
import Helmet from 'react-helmet'
import content from './content'

function GettingStarted() {
  const [currentSection, setCurrentSection] = useState(content[0].name)

  console.log(currentSection, setCurrentSection, Waypoint)

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
        <Menu currentSection={currentSection} />
        {content.map(data => (
          <Section key={data.name} data={data} />
        ))}
      </div>
    </Fragment>
  )
}

export default GettingStarted
