import React from 'react'
import styles from './styles.scss'
import RideToButton from 'components/RideTo/Button'
import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import { Waypoint } from 'react-waypoint'

const Section = React.forwardRef(function({ data, setCurrentSection }, ref) {
  const { name, img, title, text, faqs, links } = data

  const handleEnter = () => {
    setCurrentSection(name)
  }

  return (
    <div ref={ref}>
      <Waypoint onEnter={handleEnter} />
      <img className={styles.sectionImage} src={img} alt={name} />
      <div className={styles.sectionContent}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {text && <p>{text}</p>}
        {Object.keys(faqs).length && (
          <CourseTypeDetails courseType={{ details: faqs }} minimal spacedOut />
        )}
        {links.length && (
          <div className={styles.sectionButtons}>
            {links.map(({ url, text, alt }, i) => (
              <RideToButton
                className={styles.sectionButton}
                key={i}
                href={url}
                alt={alt}>
                <span>{text}</span>
                <img src={alt ? ArrowRight : ButtonArrowWhite} alt="arrow" />
              </RideToButton>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export default Section
