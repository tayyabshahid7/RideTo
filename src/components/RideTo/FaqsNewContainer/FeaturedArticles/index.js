import React, { useEffect, useState, memo } from 'react'
import classnames from 'classnames'
import get from 'lodash/get'
import { get as callApi } from 'services/api'
import styles from './styles.scss'
import RideToSlider from 'components/RideToSlider'
import { useMediaQuery } from 'react-responsive'

const settings = {
  customPaging: i => {
    return (
      <button className={styles.dot}>
        <div />
      </button>
    )
  },
  className: styles.slider,
  dotsClass: styles.dots,
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1.2,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: '0px'
}

export const getArticles = async () => {
  const path = 'blog/featured/'
  const response = await callApi(path, {}, false)
  return response
}

function FeaturedArticles() {
  const [response, setResponse] = useState(null)
  const isMobile = useMediaQuery({ maxWidth: 768 })

  const Container = !isMobile ? DesktopContainer : RideToSlider

  const articleList = get(response, 'results', [])

  useEffect(() => {
    getArticles().then(res => {
      setResponse(res)
    })
  }, [])

  const getUrl = slug => {
    return `https://www.rideto.com/blog/${slug}`
  }

  return (
    <div className={styles.featuredArticles}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.heading}>featured articles</h2>
        {/* <div className={styles.cardWrapper}> */}
        <Container settings={settings}>
          {articleList.slice(0, 3).map((item, idx) => {
            return (
              <div key={idx} className={styles.card}>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={getUrl(item.slug)}>
                  <img src={item.image_thumbnail} alt="thumb" />
                  <p>{item.title}</p>
                </a>
              </div>
            )
          })}
        </Container>
        {/* </div> */}
      </div>
    </div>
  )
}

function DesktopContainer({ children }) {
  return <div className={styles.cardWrapper}>{children} </div>
}

export default memo(FeaturedArticles)
