import React, { Component } from 'react'
import 'intersection-observer'

class LazySlide extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isVisible: false
    }

    this.image = React.createRef()
  }

  componentDidMount() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0
    }
    const observer = new IntersectionObserver(
      this.intersectionObserverCallback,
      options
    )

    observer.observe(this.image.current)
  }

  intersectionObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.setState({
          isVisible: true
        })
        observer.unobserve(entry.target)
      }
    })
  }

  render() {
    const { slide, styles } = this.props
    const { isVisible } = this.state

    return (
      <div
        key={slide.id}
        className={styles.slide}
        style={{
          backgroundImage: isVisible ? `url(${slide.details.image})` : 'none'
        }}
        ref={this.image}>
        <div className={styles.title}>{slide.name}</div>
      </div>
    )
  }
}

export default LazySlide
