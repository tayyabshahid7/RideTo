import React from 'react'
import styles from './styles.scss'
import RideToButton from 'components/RideTo/Button'
import ArrowRight from 'assets/images/rideto/ArrowRight.svg'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import { Waypoint } from 'react-waypoint'

const Section = React.forwardRef(function(
  { data, index, setCurrentSection, menuHeight },
  ref
) {
  const { name, img, title, text = null, faqs = {}, links = [] } = data

  const handleEnter = ({ currentPosition, previousPosition }) => {
    if (currentPosition === 'inside' && previousPosition === 'above') {
      setCurrentSection(index)
    }
  }

  const handleLeave = ({ currentPosition, previousPosition }) => {
    if (
      currentPosition === 'above' &&
      previousPosition === 'inside' &&
      index < 4
    ) {
      setCurrentSection(index + 1)
    }
  }

  return (
    <div className={styles.section} ref={ref}>
      <Waypoint
        onEnter={handleEnter}
        onLeave={handleLeave}
        topOffset={menuHeight + 1}
        bottomOffset={menuHeight + 1}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionImageWrap}>
            <img className={styles.sectionImage} src={img} alt={name} />
          </div>
          <div className={styles.sectionContent}>
            <h3 className={styles.sectionName}>{name}</h3>
            <h2 className={styles.sectionTitle}>{title}</h2>
            {!!text && <p>{text}</p>}
            {!!Object.keys(faqs).length && (
              <CourseTypeDetails
                courseType={{ details: faqs }}
                minimal
                spacedOut
              />
            )}
            {!!links.length && (
              <div className={styles.sectionButtons}>
                {links.map(({ url, text, alt, external }, i) => (
                  <RideToButton
                    className={styles.sectionButton}
                    key={i}
                    href={url}
                    alt={alt}
                    target={external ? '_blank' : undefined}>
                    <span>{text}</span>
                    <img
                      src={alt ? ArrowRight : ButtonArrowWhite}
                      alt="arrow"
                    />
                  </RideToButton>
                ))}
              </div>
            )}
          </div>
        </div>
      </Waypoint>
    </div>
  )
})

export default Section
