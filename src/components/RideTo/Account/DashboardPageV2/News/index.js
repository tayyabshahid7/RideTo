import React, { useState, useEffect, Fragment, useRef } from 'react'
import styles from './styles.scss'
import NewsItem from './NewsItem'
import Button from 'components/RideTo/Button'
import { fetchArticles } from 'services/dashboard'
import Filters from './Filters'
import classnames from 'classnames'
import debounce from 'lodash/debounce'
import { fetchBikes } from 'services/dashboard'

const FILTERS = {
  'Latest Blogs': null,
  'How Tos': 9,
  Reviews: null,
  Bikes: 6,
  Rides: 12,
  Fun: 10
  // Events: 11
}

function News({
  selectedGoal,
  selectedStyle,
  updateSticky,
  isStuck,
  isUserDetailsLoaded,
  copyrightRef,
  setCopyrightHeight
}) {
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
      const { current: currentCopyright } = copyrightRef

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

      const copyrightRect = currentCopyright.getBoundingClientRect()

      if (copyrightRect.y < window.innerHeight) {
        setCopyrightHeight(window.innerHeight - copyrightRect.y)
      } else {
        setCopyrightHeight(0)
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
        document.documentElement.offsetHeight - 333
      ) {
        if (!isLoading && next) {
          handleLoadMoreClick()
        }
      }
    }, 100)

    window.removeEventListener('scroll', debouncedScroll)
    window.addEventListener('scroll', debouncedScroll)

    return () => {
      window.removeEventListener('scroll', debouncedScroll)
    }
  }, [isLoading, next])

  useEffect(() => {
    setNews([])
    setNext(true)
    setPage(1)
  }, [selectedGoal, selectedStyle, filter])

  useEffect(() => {
    async function fetchMyArticles() {
      setIsLoading(true)
      let response = null

      if (filter === 'Reviews') {
        response = await fetchBikes(selectedGoal)
      } else {
        const categoryId = FILTERS[filter]

        try {
          response = await fetchArticles(
            page,
            selectedGoal.slug,
            selectedStyle.slug,
            categoryId
          )
        } catch (error) {
          setNews([])
          setNext(true)
          setPage(1)
          response = await fetchArticles(
            1,
            selectedGoal.slug,
            selectedStyle.slug,
            categoryId
          )
        }
      }

      if (response) {
        setNews(prevState => {
          return [...prevState, ...response.results]
        })
        setNext(response.next)
      }

      setIsLoading(false)
    }

    if (!isLoading && isUserDetailsLoaded) {
      fetchMyArticles()
    }
  }, [page, selectedGoal, selectedStyle, filter, isUserDetailsLoaded])

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
                filters={Object.keys(FILTERS)}
                selectedFilter={filter}
                handleFilterClick={handleFilterClick}
              />
            </div>
          </div>
        </div>
        <div className={styles.results}>
          {news.length > 0 ? (
            <ul className={styles.list}>
              {news.map((item, i) => (
                <NewsItem key={i} news={item} contentType={filter} />
              ))}
            </ul>
          ) : (
            <Fragment>
              {!isLoading && (
                <p className={styles.noArticles}>No articles available...</p>
              )}
            </Fragment>
          )}
        </div>
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
