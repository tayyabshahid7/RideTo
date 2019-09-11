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
    setPage(1)
    setNews([])
    setNext(true)
  }, [selectedGoal, selectedStyle, filter])

  useEffect(() => {
    async function fetchMyArticles() {
      const response = await fetchArticles(
        page,
        selectedGoal.slug,
        selectedStyle.slug,
        filter
      )

      setNews(prevState => {
        return [...prevState, ...response.results]
      })
      setNext(response.next)
    }

    fetchMyArticles()
  }, [page, selectedGoal, selectedStyle, filter])

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
      <Fragment>
        <h2 className={styles.title}>News Feed</h2>
        <Filters
          selectedFilter={filter}
          handleFilterClick={handleFilterClick}
        />
        {news.length > 0 && (
          <ul className={styles.list}>
            {news.map((item, i) => (
              <NewsItem key={i} news={item} />
            ))}
          </ul>
        )}
      </Fragment>
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
