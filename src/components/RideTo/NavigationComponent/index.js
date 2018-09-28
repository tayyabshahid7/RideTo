import React, { Component } from 'react'
import styles from './styles.scss'
import NavigationItem from './NavigationItem'

class NavigationComponent extends Component {
  onNavClick(navIndex) {
    const { navigation } = this.props
    let navItem = navigation[navIndex]
    if (navItem.disabled || navItem.active) {
      return
    }
    let url = '/'
    if (navIndex === 0) {
      url = '/'
    } else if (navIndex === 1) {
      url = '/course-type-selection/'
    } else if (navIndex === 2) {
      url = '/course-location/'
    } else if (navIndex === 3) {
      url = '/course-addons/'
    }
    let params = []
    for (let i = 0; i < navIndex; i++) {
      params.push(navigation[i].queryValue)
    }
    window.location = `${url}?${params.join('&')}`
  }

  render() {
    const { navigation } = this.props
    return (
      <div className={styles.container}>
        {navigation.map((naviItem, index) => (
          <NavigationItem
            {...naviItem}
            onClick={() => this.onNavClick(index)}
            key={naviItem.title}
            showLeftBorder={index !== 0}
          />
        ))}
      </div>
    )
  }
}

export default NavigationComponent
