/* TODO:

Discuss endpoint to be hit on load:
-courses
-courseType
-AlternativeDates:
- date
-url
-userName
-courseReferenceNumber

Figure out what to do about following click events on course Items:
- clicked details
-clicked reviews

Discuss endpoints to be hit on submit:
- alternative dates
-alternative locations

Adjust style:
    -fonts
    -spacing
*/

import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import styles from './CourseAlternativeDatesSelection.scss'
import rideToMinimalGreenImg from 'assets/images/rideToMinimalGreen.jpg'
import CourseItem from './CourseItem'

const Header = ({ userName }) => {
  const HeaderText = ({ userName }) => {
    return (
      <div className={styles.headerTextWrapper}>
        <p>{`Hey ${userName}, unfortunately the data you requested is no longer available with the instructor.`}</p>
        <p>
          This happens sometimes when they have received multiple bookings at
          the same time or can no longer offer the date. Not to worry! We have
          some options for you:
        </p>
      </div>
    )
  }

  return (
    <div className={styles.header}>
      <div className={styles.headerLogoWrapper}>
        <img
          className={styles.headerLogo}
          src={rideToMinimalGreenImg}
          alt="rideto logo green"
        />
      </div>

      <HeaderText userName={userName} />
    </div>
  )
}

const AlternativeDatesOption = ({
  index,
  alternativeDates,
  courseReferenceNumber
}) => {
  return (
    <div
      className={classnames(
        styles.alternativeDatesOption,
        styles.optionWrapper
      )}>
      <div className={styles.optionHeader}>
        <h5 className={styles.optionTitle}>
          <span>{index}. Alternative dates:</span>
        </h5>

        <p className={styles.optionSupTitle}>
          The Instructor offered the below alternative dates. Click to accept
          one of these:
        </p>
      </div>

      <div className={styles.optionContent}>
        {alternativeDates.map(({ date, url }) => {
          return (
            <a className={styles.alternativeDateLink} href={url} key={date}>
              {date}
            </a>
          )
        })}
      </div>

      <div className={styles.optionFooter}>
        <strong>There are also other dates available,</strong>
        drop us an email to{' '}
        <a
          href={`mailto:hello@rideto.com?Subject=Order#${courseReferenceNumber}%20-%20Course%20dates%20unavailable`}>
          hello@rideto.com
        </a>{' '}
        and quote your order reference {courseReferenceNumber}. A member of the
        team will be able to find an alternative date at this location which
        works for you.
      </div>
    </div>
  )
}
const AlternativeLocationsOption = ({
  index,
  courses,
  courseType,
  handleDetailClick,
  handlePriceClick,
  handleReviewClick
}) => {
  return (
    <div
      className={classnames(
        styles.alternativeLocationsOption,
        styles.optionWrapper
      )}>
      <div className={styles.optionHeader}>
        <h5 className={styles.optionTitle}>
          <span>{index}. Other instant book locations:</span>
        </h5>

        <p className={styles.optionSupTitle}>
          In your area we also have the below instant book locations. These are
          live instructor diaries, so you're guaranteed to get the space shown.
          Click to move your booking to one of these instructors. Any price
          difference will be automatically refunded or charged.
        </p>
      </div>

      <div className={styles.optionContent}>
        {courses.map(course => {
          return (
            <CourseItem
              courseType={courseType}
              showCallMessage={false}
              id={`card-course-${course.id}`}
              unavaiableDate={false}
              course={course}
              className={styles.alternativeLocationCourseItem}
              key={course.id}
              handleDetailClick={handleDetailClick}
              handlePriceClick={handlePriceClick}
              handleReviewClick={handleReviewClick}
            />
          )
        })}
      </div>
    </div>
  )
}
const ContactUsOption = ({ index, courseReferenceNumber }) => {
  return (
    <div className={classnames(styles.contactUsOption, styles.optionWrapper)}>
      <div className={styles.optionHeader}>
        <h5 className={styles.optionTitle}>
          <span>{index}. None of the above working for you?</span>
        </h5>

        <p className={styles.optionSupTitle}>
          Drop us an email to{' '}
          <a
            href={`mailto:hello@rideto.com?Subject=Order#${courseReferenceNumber}%20-%20Course%20dates%20unavailable`}>
            hello@rideto.com
          </a>{' '}
          and quote your order reference {courseReferenceNumber}. A member of
          the team will be able to find an alternative date at this location
          which works for you.
        </p>
      </div>
    </div>
  )
}

const CourseAlternativeDatesSelection = () => {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState({})
  const [courseType, setCourseType] = useState(undefined)
  const [alternativeDates, setAlternativeDates] = useState([])
  const [userName, setUserName] = useState(undefined)
  const [courseReferenceNumber, setcourseReferenceNumber] = useState(undefined)

  useEffect(() => {
    const fetchData = async () => {
      //fetch data here

      setUserName('Test User Name')
      setAlternativeDates([
        { date: 'Sunday', url: 'https://www.google.com' },
        { date: 'Monday', url: 'https://www.google.com' },
        { date: 'Tuesday', url: 'https://www.google.com' }
      ])
      setcourseReferenceNumber('RFID#1234')
      setCourses([
        {
          id: 44,
          is_partner: true,
          image_thumbnail:
            '/media/Supplier/ipass-osterley/Motorcycle-Training-London-Osterley-CBT-Training-RideTo-c.jpg',
          image:
            '/media/Supplier/ipass-osterley/Motorcycle-Training-London-Osterley-CBT-Training-RideTo-c.jpg',
          location_slug: 'hounslow',
          place: 'Indian Gymkhana Club, Osterley',
          postcode: 'TW7 4NQ',
          mciac_approved: false,
          bike_hire: true,
          helmet_hire: true,
          gloves_jacket_included: true,
          on_site_cafe: false,
          indoor_classroom: true,
          instant_book: true,
          distance_miles: 2.27211407159883,
          rating: 4.6,
          number_of_reviews: 144,
          name: 'IPASS CBT Osterley',
          email: 'james+notification@rideto.com',
          lat: 51.48073,
          lng: -0.34851,
          date: null,
          is_available_on: true,
          price: 10999
        },
        {
          id: 689,
          is_partner: true,
          image_thumbnail:
            '/media/Supplier/heathrow-motorcycle-training/Heathrow-Motorcycle-Training-CBT-Test-west-London--1-1-a.jpg',
          image:
            '/media/Supplier/heathrow-motorcycle-training/Heathrow-Motorcycle-Training-CBT-Test-west-London--1-1-a.jpg',
          location_slug: 'hounslow',
          place: 'Feltham & Hanworth Airparks Leisure, Hanworth, London',
          postcode: 'TW13 5EG',
          mciac_approved: false,
          bike_hire: true,
          helmet_hire: true,
          gloves_jacket_included: false,
          on_site_cafe: false,
          indoor_classroom: false,
          instant_book: true,
          distance_miles: 2.879460403944683,
          rating: 4.6,
          number_of_reviews: 64,
          name: 'Heathrow Motorcycle Training',
          email: 'james+notification@rideto.com',
          lat: 51.441285,
          lng: -0.390585,
          date: null,
          is_available_on: true,
          price: 11599
        },
        {
          id: 995,
          is_partner: true,
          image_thumbnail:
            '/media/Supplier/west-london-motorcycle-training/CBT-Training-West-London-RideTo-3.jpg',
          image:
            '/media/Supplier/west-london-motorcycle-training/CBT-Training-West-London-RideTo-3.jpg',
          location_slug: 'feltham',
          place: 'Fairholme School, Peacock Avenue,, Feltham',
          postcode: 'TW14 8ET',
          mciac_approved: false,
          bike_hire: true,
          helmet_hire: true,
          gloves_jacket_included: false,
          on_site_cafe: false,
          indoor_classroom: true,
          instant_book: false,
          distance_miles: 4.699913863559448,
          rating: 4.9,
          number_of_reviews: 172,
          name: 'West London Motorcycle Training',
          email: 'james+notification@rideto.com',
          lat: 51.448807,
          lng: -0.434689,
          date: null,
          is_available_on: true,
          price: 10999
        }
      ])
      setCourseType('FULL_LICENCE')
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div>Loading ...</div>
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Header userName={userName} />

        <div className={styles.body}>
          <div className={styles.optionsContainer}>
            <AlternativeDatesOption
              index={1}
              alternativeDates={alternativeDates}
              courseReferenceNumber={courseReferenceNumber}
            />

            <AlternativeLocationsOption
              index={2}
              courses={courses}
              courseType={courseType}
              handleDetailClick={() =>
                console.log('handleDetailClick activated')
              }
              handlePriceClick={() => console.log('handlePriceClick activated')}
              handleReviewClick={() =>
                console.log('handleReviewClick activated')
              }
            />

            <ContactUsOption
              index={3}
              courseReferenceNumber={courseReferenceNumber}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseAlternativeDatesSelection
