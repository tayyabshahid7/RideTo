import React, { Component } from 'react'
import 'intersection-observer'

class Image extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isVisible: false
    }

    this.image = React.createRef()
  }

  componentDidMount() {
    const observer = new IntersectionObserver(this.intersectionObserverCallback)

    observer.observe(this.image.current)
  }

  intersectionObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      this.setState({
        isVisible: true
      })
      observer.unobserve(entry.target)
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

export default Image
