import React, { Fragment, useState, useRef, createRef } from 'react'
import Splash from './Splash'
import Menu from './Menu'
import Section from './Section'
import styles from './styles.scss'
import Helmet from 'react-helmet'
import content from './content'
import { useMediaQuery } from 'react-responsive'

function GettingStarted() {
  const [currentSection, setCurrentSection] = useState(0)

  const sectionRefs = useRef(content.map(() => createRef()))

  const menuHeight = useMediaQuery({ query: '(min-width: 933px)' }) ? 89 : 56

  const scrollTo = index => {
    const el = sectionRefs.current[index].current
    const offset = el.offsetTop - menuHeight

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
            menuHeight={menuHeight}
          />
        ))}
      </div>
    </Fragment>
  )
}

export default GettingStarted
