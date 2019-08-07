import React from 'react'
import styles from './styles.scss'
import ArrowRight from 'assets/images/rideto/ArrowRight.svg'

function NewsItem({ news: { image, title, url } }) {
  return (
    <a className={styles.container} href={url}>
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
  )
}

export default NewsItem
