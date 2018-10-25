import React from 'react'
import classnames from 'classnames'
import styles from './UserMenuItem.scss'
import {
  getUserProfile,
  getToken,
  isAuthenticated,
  removeToken
} from 'services/auth'

class UserMenuItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: null,
      user: null,
      menuOpen: false
    }

    this.handleMenuToggle = this.handleMenuToggle.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount() {
    if (isAuthenticated()) {
      const user = getUserProfile(getToken())
      sessionStorage.setItem('login-next', JSON.stringify('/account/login'))
      this.setState({ text: 'Logout', user: user })
    } else {
      this.setState({ text: 'Login' })
      sessionStorage.setItem('login-next', JSON.stringify('/account/dashboard'))
    }
  }

  handleMenuToggle() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  handleLogout() {
    this.setState({ menuOpen: false, user: null, text: '' })
    removeToken()
    window.location = '/'
  }

  render() {
    const { menuOpen, text, user } = this.state
    return (
      <React.Fragment>
        {!user ? (
          <a href="/account/login">{text}</a>
        ) : (
          <div>
            <div
              className={classnames(styles.userName, styles.hiddenOnMobile)}
              onClick={this.handleMenuToggle}>
              {user.username}
            </div>
            <div
              className={classnames(
                styles.mobileUserLinks,
                styles.hiddenOnDesktop
              )}>
              <a href="/account/dashboard">Dashboard</a>
              <a onClick={this.handleLogout}>Logout</a>
            </div>
            {menuOpen && (
              <div className={styles.overlay}>
                <div className={styles.navLinks}>
                  <a href="/account/dashboard">Dashboard</a>
                </div>
                <div>
                  <div className={styles.divider} />
                  <a className={styles.logoutLink} onClick={this.handleLogout}>
                    Logout
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default UserMenuItem
