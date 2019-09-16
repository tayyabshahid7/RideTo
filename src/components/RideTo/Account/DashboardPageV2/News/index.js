import React, { useState, useEffect, Fragment, useRef } from 'react'
import styles from './styles.scss'
import NewsItem from './NewsItem'
import Button from 'components/RideTo/Button'
import { fetchArticles } from 'services/dashboard'
import Filters from './Filters'
import classnames from 'classnames'
import { debounce } from 'lodash'

function News({ selectedGoal, selectedStyle, updateSticky, isStuck }) {
  const [page, setPage] = useState(1)
  const [news, setNews] = useState([])
  const [next, setNext] = useState(true)
  const [filter, setFilter] = useState('Latest Blogs')
  const [isLoading, setIsLoading] = useState(false)
  const feedEl = useRef(null)

  useEffect(() => {
    let frameId = 0

    const handleScroll = () => {
      const { current } = feedEl

      frameId = 0

      if (!current) {
        return
      }

      const currentRect = current.getBoundingClientRect()

      if (currentRect.y < 0) {
        updateSticky(true)
      } else {
        updateSticky(false)
      }
    }

    const debouncedScroll = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(handleScroll)
      }
    }

    if (feedEl.current) {
      window.addEventListener('scroll', debouncedScroll)
    }

    return () => {
      window.removeEventListener('scroll', debouncedScroll)

      if (frameId) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  useEffect(() => {
    const debouncedScroll = debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >
        document.documentElement.offsetHeight - 250
      ) {
        if (!isLoading && next) {
          handleLoadMoreClick()
        }
      }
    }, 100)

    window.addEventListener('scroll', debouncedScroll)

    return () => {
      window.removeEventListener('scroll', debouncedScroll)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    setNews([])
    setNext(true)
  }, [selectedGoal, selectedStyle, filter])

  useEffect(() => {
    async function fetchMyArticles() {
      setIsLoading(true)
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
      setIsLoading(false)
    }

    if (!isLoading) {
      fetchMyArticles()
    }
  }, [page, selectedGoal, selectedStyle, filter])

  const handleLoadMoreClick = () => {
    setPage(prevPage => prevPage + 1)
  }

  const handleFilterClick = selected => {
    if (isStuck) {
      const { current } = feedEl

      window.scrollTo(0, current.offsetTop)
    }

    if (filter === selected) {
      setFilter(null)
    } else {
      setFilter(selected)
    }
  }

  return (
    <div className={styles.container} ref={feedEl}>
      <Fragment>
        <div
          className={classnames(
            styles.titleFilters,
            isStuck && styles.titleFiltersStuck
          )}>
          <div className={styles.titleFiltersInner}>
            <div className={styles.titleFiltersInnerWrap}>
              <h2 className={styles.title}>News Feed</h2>
              <Filters
                selectedFilter={filter}
                handleFilterClick={handleFilterClick}
              />
            </div>
          </div>
        </div>
        {news.length > 0 && (
          <ul className={styles.list}>
            {news.map((item, i) => (
              <NewsItem key={i} news={item} contentType={filter} />
            ))}
          </ul>
        )}
      </Fragment>
      {next && (
        <Button
          alt
          modern
          className={styles.loadMore}
          onClick={handleLoadMoreClick}
          disabled={isLoading}>
          <span>{isLoading ? 'Loading...' : 'Load more'}</span>
        </Button>
      )}
    </div>
  )
}

export default News
