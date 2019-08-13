import React, { useState, useEffect } from 'react'
import styles from './styles.scss'
import NewsItem from './NewsItem'
import Button from 'components/RideTo/Button'
import { fetchArticles } from 'services/dashboard'

function News() {
  const [page, setPage] = useState(1)
  const [news, setNews] = useState([])
  const [next, setNext] = useState(true)

  useEffect(() => {
    async function fetchMyArticles() {
      const response = await fetchArticles(page)

      setNews(prevState => {
        return [...prevState, ...response.results]
      })
      setNext(response.next)
    }

    fetchMyArticles()
  }, [page])

  const handleLoadMoreClick = () => {
    setPage(prevPage => prevPage + 1)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Latest advice and guides</h2>
      <ul className={styles.list}>
        {news.map((item, i) => (
          <NewsItem key={i} news={item} />
        ))}
      </ul>
      {next && (
        <Button
          alt
          modern
          className={styles.loadMore}
          onClick={handleLoadMoreClick}>
          <span>Load more</span>
        </Button>
      )}
    </div>
  )
}

export default News
