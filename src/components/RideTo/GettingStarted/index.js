import React, { Fragment, useState, useRef, createRef } from 'react'
import Splash from './Splash'
import Menu from './Menu'
import Section from './Section'
import styles from './styles.scss'
import Helmet from 'react-helmet'
import content from './content'

function GettingStarted() {
  const [currentSection, setCurrentSection] = useState(content[0].name)
  const sectionRefs = useRef(content.map(() => createRef()))

  const scrollTo = index => {
    const el = sectionRefs.current[index].current

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <Fragment>
      <Helmet>
        <title>Rideto | Getting Started</title>
      </Helmet>
      <div className={styles.container}>
        <Splash scrollTo={scrollTo} />
        <Menu
          names={content.map(({ name }) => name)}
          currentSection={currentSection}
          scrollTo={scrollTo}
        />
        {content.map((data, i) => (
          <Section
            key={i}
            index={i}
            ref={sectionRefs.current[i]}
            data={data}
            setCurrentSection={setCurrentSection}
          />
        ))}
      </div>
    </Fragment>
  )
}

export default GettingStarted
