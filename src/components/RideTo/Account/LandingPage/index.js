import React from 'react'
import { Link } from 'react-router-dom'

import NavigationComponent from 'components/RideTo/NavigationComponent'
import Envelope from 'assets/images/rideto/Envelope.svg'
import styles from './LandingPage.scss'

const isMobile = () => {
  return window.innerWidth < 768 || window.screen.width < 768
}

class LandingPage extends React.Component {
  constructor(props) {
    super(props)

    this.navigation = [
      {
        title: isMobile() ? 'Go Back' : 'Sign up to RideTo',
        subtitle: (
          <div className={styles.navigation}>
            If you already have an account you can{' '}
            <Link to="/account/login">log in</Link>
          </div>
        )
      }
    ]

    this.handleBack = this.handleBack.bind(this)
    this.handleNavigation = this.handleNavigation.bind(this)
  }

  handleBack() {
    const { history } = this.props
    history.goBack()
  }

  handleNavigation() {
    const { history } = this.props
    history.push('/account/login')
  }

  render() {
    return (
      <React.Fragment>
        <NavigationComponent
          navigation={this.navigation}
          onNavBack={this.handleBack}
          onNavClick={this.handleNavigation}
        />
        <div className={styles.landingPage}>
          <h2 className={styles.heading}>Hi, you look new here</h2>
          <Link to="/account/signup" className={styles.email}>
            <img src={Envelope} alt="" />
            <span>Sign Up With Email</span>
          </Link>
          <div className={styles.subaction}>
            Already have an account? <Link to="/account/login">Login</Link>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default LandingPage
