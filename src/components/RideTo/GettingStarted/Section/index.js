import React from 'react'
import styles from './styles.scss'
import RideToButton from 'components/RideTo/Button'
import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import { Waypoint } from 'react-waypoint'

const Section = React.forwardRef(function(
  { data, index, setCurrentSection },
  ref
) {
  const { name, img, title, text, faqs, links } = data

  const handleEnter = () => {
    setCurrentSection(index)
  }

  return (
    <div className={styles.section} ref={ref}>
      <Waypoint onEnter={handleEnter} />
      <div className={styles.sectionInner}>
        <img className={styles.sectionImage} src={img} alt={name} />
        <div className={styles.sectionContent}>
          <h3 className={styles.sectionName}>{name}</h3>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {text && <p>{text}</p>}
          {Object.keys(faqs).length && (
            <CourseTypeDetails
              courseType={{ details: faqs }}
              minimal
              spacedOut
            />
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
    </div>
  )
})

export default Section
