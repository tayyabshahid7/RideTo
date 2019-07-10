import React, { Fragment, useState, useRef, createRef } from 'react'
import Splash from './Splash'
import Menu from './Menu'
import Section from './Section'
import styles from './styles.scss'
import Helmet from 'react-helmet'
import content from './content'
import { useMediaQuery } from 'react-responsive'

function GettingStarted() {
  const [currentSection, setCurrentSection] = useState(content[0].name)

  const sectionRefs = useRef(content.map(() => createRef()))

  const isDesktop = useMediaQuery({ query: '(min-width: 933px)' })

  const scrollTo = index => {
    const el = sectionRefs.current[index].current
    const offset = el.offsetTop - (isDesktop ? 89 : 56)

    window.scrollTo({
      top: offset,
      behavior: 'smooth'
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
