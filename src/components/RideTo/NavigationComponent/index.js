import React from 'react'
import styles from './styles.scss'
import NavigationItem from './NavigationItem'
import NavigationItemPostcode from './NavigationItemPostcode'
import ArrowLeft from 'assets/images/rideto/ArrowLeft.svg'

class NavigationComponent extends React.Component {
  handleNavClick(navIndex, fullWidth) {
    const { navigation } = this.props
    let navItem = navigation[navIndex]
    if (fullWidth || navItem.disabled || navItem.active) {
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

  handleNavPostcodeClick(postcode) {
    this.props.onPostcodeChange(postcode)
  }

  render() {
    const { navigation, onNavBack } = this.props
    const fullWidth = navigation.length === 1

    return (
      <div className={styles.container}>
        {onNavBack && (
          <div className={styles.backItem} onClick={onNavBack}>
            <img src={ArrowLeft} alt="" />
          </div>
        )}

        {navigation.map(
          (naviItem, index) =>
            index === 0 && naviItem.title.toUpperCase() === 'POSTCODE' ? (
              <NavigationItemPostcode
                {...naviItem}
                fullWidth={fullWidth}
                onPostcodeUpdate={postcode =>
                  this.handleNavPostcodeClick(postcode)
                }
                key={naviItem.title}
              />
            ) : (
              <NavigationItem
                {...naviItem}
                fullWidth={fullWidth}
                onClick={() => this.handleNavClick(index, fullWidth)}
                key={naviItem.title}
              />
            )
        )}
      </div>
    )
  }
}

export default NavigationComponent
