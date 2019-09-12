import React, { useState } from 'react'
import styles from './styles.scss'
import RideToButton from 'components/RideTo/Button'
import truncate from 'lodash/truncate'
import RideToScore from 'components/RideTo/BikeSales/BikeReview/RideToScore'
import YouTube from 'react-youtube'

const INTRO =
  'Aliqua incididunt ut exercitation culpa id duis dolor commodo nisi do cillum aliqua pariatur sed occaecat ut mollit cupidatat incididunt velit magna commodo aliqua officia ut occaecat duis ut ut pariatur non esse pariatur voluptate.'

const CONTENT_TYPE_CTAS = {
  'Latest Blogs': 'Read Blog',
  'How Tos': null,
  Reviews: 'Read Review',
  Bikes: 'View Bike',
  Rides: 'See Route',
  Fun: 'Read Article',
  Events: 'View Event'
}

function NewsItem({ news: { image, title, slug }, contentType }) {
  const [isReadingMore, setIsReadingMore] = useState(false)
  const intro = isReadingMore
    ? INTRO
    : truncate(INTRO, { separator: ' ', length: 140 })

  const handleReadMoreClick = () => {
    setIsReadingMore(true)
  }

  return (
    <article className={styles.container}>
      <div className={styles.header}>
        <img
          className={styles.profilePic}
          src="https://via.placeholder.com/66x66"
          alt="Profile"
        />
        <div className={styles.meta}>
          <h3>James B | RideTo</h3>
          <div className={styles.time}>28th August 17:36</div>
        </div>
      </div>
      {intro && (
        <div className={styles.intro}>
          {intro}{' '}
          {!isReadingMore && (
            <button onClick={handleReadMoreClick} className={styles.readMore}>
              Read More
            </button>
          )}
        </div>
      )}
      <div className={styles.media}>
        {contentType !== 'How Tos' ? (
          <img src={image} alt={title} />
        ) : (
          <YouTube videoId="9zAh9RZAJBo" />
        )}
      </div>
      {contentType !== 'How Tos' && (
        <div className={styles.footer}>
          <div className={styles.description}>
            <h2 className={styles.footerTitle}>Voluptate sed nisi esse.</h2>
            <div className={styles.footerSubtitle}>Rideto.com</div>
          </div>
          {contentType === 'Reviews' && <RideToScore score={90} small />}
          <div className={styles.footerButton}>
            <RideToButton href={`/blog/${slug}`} className={styles.readButton}>
              {CONTENT_TYPE_CTAS[contentType]}
            </RideToButton>
          </div>
        </div>
      )}
    </article>
  )
}

export default NewsItem
