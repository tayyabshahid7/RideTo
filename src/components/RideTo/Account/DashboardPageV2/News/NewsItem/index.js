import React, { useState } from 'react'
import styles from './styles.scss'
import RideToButton from 'components/RideTo/Button'
import truncate from 'lodash/truncate'

/*
<a className={styles.container} href={`/blog/${slug}`}>
  <div className={styles.image}>
    <img src={image} alt={title} />
  </div>
  <div className={styles.content}>
    <h3 className={styles.title}>{title}</h3>
    <div className={styles.button}>
      <img src={ArrowRight} alt="" />
    </div>
  </div>
</a>
*/

const INTRO =
  'Aliqua incididunt ut exercitation culpa id duis dolor commodo nisi do cillum aliqua pariatur sed occaecat ut mollit cupidatat incididunt velit magna commodo aliqua officia ut occaecat duis ut ut pariatur non esse pariatur voluptate.'

function NewsItem({ news: { image, title, slug } }) {
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
      <div className={styles.intro}>
        {intro}{' '}
        {!isReadingMore && (
          <button onClick={handleReadMoreClick} className={styles.readMore}>
            Read More
          </button>
        )}
      </div>
      <img src={image} alt={title} className={styles.poster} />
      <div className={styles.footer}>
        <div className={styles.description}>
          <h2>Voluptate sed nisi esse.</h2>
          <div className={styles.domain}>Rideto.com</div>
        </div>
        <RideToButton href={`/blog/${slug}`} className={styles.readButton}>
          Read Blog
        </RideToButton>
      </div>
    </article>
  )
}

export default NewsItem
