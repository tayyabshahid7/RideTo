import React, { useState, Fragment } from 'react'
import styles from './styles.scss'
import RideToButton from 'components/RideTo/Button'
import truncate from 'lodash/truncate'
import RideToScore from 'components/RideTo/BikeSales/BikeReview/RideToScore'
import YouTube from 'react-youtube'
import isURL from 'is-url'
import moment from 'moment'
import getYouTubeID from 'get-youtube-id'

const CONTENT_TYPE_CTAS = {
  'Latest Blogs': 'Read Blog',
  'How Tos': null,
  Reviews: 'Read Review',
  Bikes: 'View Bike',
  Rides: 'See Route',
  Fun: 'Read Article',
  Events: 'View Event'
}

function NewsItem({ news, contentType }) {
  let {
    image,
    title,
    slug,
    content,
    created,
    author,
    extra_url,
    author_image
  } = news
  const youtubeId = getYouTubeID(extra_url)

  if (content) {
    content = new DOMParser()
      .parseFromString(content, 'text/html')
      .querySelector('p').textContent
  }

  const [isReadingMore, setIsReadingMore] = useState(false)
  const intro = isReadingMore
    ? content
    : truncate(content, { separator: ' ', length: 140 })
  const isReviews = contentType === 'Reviews'

  const handleReadMoreClick = () => {
    setIsReadingMore(true)
  }

  if (isReviews) {
    image = news.images && news.images[0].image
    title = news.bike_model
    slug = news.url
  }

  let hostname = isURL(slug) ? new URL(slug).hostname : 'rideto.com'

  return (
    <article className={styles.container}>
      {!isReviews && (
        <Fragment>
          <div className={styles.header}>
            {author_image && (
              <img
                className={styles.profilePic}
                src={author_image}
                alt="Profile"
              />
            )}
            <div className={styles.meta}>
              <h3>{author} | RideTo</h3>
              <div className={styles.time}>
                {moment(created).format('Do MMMM HH:mm')}
              </div>
            </div>
          </div>
          {intro && (
            <div className={styles.intro}>
              {intro}{' '}
              {!isReadingMore && content.length > intro.length && (
                <button
                  onClick={handleReadMoreClick}
                  className={styles.readMore}>
                  Read More
                </button>
              )}
            </div>
          )}
        </Fragment>
      )}
      <div className={styles.media}>
        {contentType !== 'How Tos' ? (
          <img src={image} alt={title} />
        ) : (
          youtubeId && <YouTube videoId={youtubeId} />
        )}
      </div>
      {contentType !== 'How Tos' && (
        <div className={styles.footer}>
          <div className={styles.description}>
            <h2 className={styles.footerTitle}>{title}</h2>
            <div className={styles.footerSubtitle}>{hostname}</div>
          </div>
          {contentType === 'Reviews' && <RideToScore score={90} small />}
          <div className={styles.footerButton}>
            <RideToButton
              href={isReviews ? slug : `/blog/${slug}`}
              className={styles.readButton}>
              {CONTENT_TYPE_CTAS[contentType]}
            </RideToButton>
          </div>
        </div>
      )}
    </article>
  )
}

export default NewsItem
