import React, { useState, useEffect, Fragment } from 'react'
import styles from './styles.scss'
import NewsItem from './NewsItem'
import Button from 'components/RideTo/Button'
import { fetchArticles } from 'services/dashboard'
import Filters from './Filters'

function News({ selectedGoal, selectedStyle }) {
  const [page, setPage] = useState(1)
  const [news, setNews] = useState([])
  const [next, setNext] = useState(true)
  const [filter, setFilter] = useState(null)

  useEffect(() => {
    async function fetchMyArticles() {
      const response = await fetchArticles(
        page,
        selectedGoal.slug,
        selectedStyle.slug
      )

      setNews(prevState => {
        return [...prevState, ...response.results]
      })
      setNext(response.next)
    }

    fetchMyArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleLoadMoreClick = () => {
    setPage(prevPage => prevPage + 1)
  }

  const handleFilterClick = selected => {
    if (filter === selected) {
      setFilter(null)
    } else {
      setFilter(selected)
    }
  }

  return (
    <div className={styles.container}>
      {news.length > 0 && (
        <Fragment>
          <h2 className={styles.title}>News Feed</h2>
          <Filters
            selectedFilter={filter}
            handleFilterClick={handleFilterClick}
          />
          <ul className={styles.list}>
            {news.map((item, i) => (
              <NewsItem key={i} news={item} />
            ))}
          </ul>
        </Fragment>
      )}
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
