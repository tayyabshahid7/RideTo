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
      user: null,
      menuOpen: false
    }

    this.handleMenuToggle = this.handleMenuToggle.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount() {
    if (isAuthenticated()) {
      const user = getUserProfile(getToken())
      this.setState({ user: user })
    }
  }

  handleMenuToggle() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  handleLogout() {
    this.setState({ menuOpen: false, user: null })
    removeToken()
    sessionStorage.removeItem('login-next')
    window.location = '/'
  }

  render() {
    const { menuOpen, user } = this.state
    return (
      <React.Fragment>
        {!user ? (
          <a href="/account/login">Login</a>
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
              <div className={styles.divider} />
              <button className={styles.logoutLink} onClick={this.handleLogout}>
                Logout
              </button>
            </div>
            {menuOpen && (
              <div className={styles.overlay}>
                <div className={styles.navLinks}>
                  <a href="/account/dashboard">Dashboard</a>
                </div>
                <div>
                  <div className={styles.divider} />
                  <button
                    className={styles.logoutLink}
                    onClick={this.handleLogout}>
                    Logout
                  </button>
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
