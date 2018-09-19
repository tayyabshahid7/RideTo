import React, { Component } from 'react'
import styles from './styles.scss'
import NavigationItem from './NavigationItem'

class NavigationComponent extends Component {
  render() {
    const { navigation, onNavClick } = this.props
    return (
      <div className={styles.container}>
        {navigation.map((naviItem, index) => (
          <NavigationItem
            {...naviItem}
            onClick={onNavClick}
            key={naviItem.title}
            showLeftBorder={index !== 0}
          />
        ))}
      </div>
    )
  }
}

export default NavigationComponent
