import React from 'react'
import styles from './styles.scss'
import NewsItem from './NewsItem'
import Button from 'components/RideTo/Button'

const NEWS = [
  {
    image: 'https://via.placeholder.com/312x208',
    title: 'The Best 125cc scooters you can buy today',
    url: '/'
  },
  {
    image: 'https://via.placeholder.com/312x208',
    title: 'The Best off road motorbikes for winter',
    url: '/'
  },
  {
    image: 'https://via.placeholder.com/312x208',
    title: 'The Best off road motorbikes for winter',
    url: '/'
  }
]

function News() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Latest advice and guides</h2>
      <ul className={styles.list}>
        {NEWS.map((item, i) => (
          <NewsItem key={i} news={item} />
        ))}
      </ul>
      <Button alt modern className={styles.loadMore}>
        <span>Load more</span>
      </Button>
    </div>
  )
}

export default News
