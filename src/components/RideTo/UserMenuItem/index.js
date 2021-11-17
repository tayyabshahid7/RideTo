import React, { Fragment } from 'react'
import {
  getToken,
  getUserProfile,
  isAuthenticated,
  removeToken
} from 'services/auth'

import UserIcon from './UserIcon'
import classnames from 'classnames'
import styles from './UserMenuItem.scss'

class UserMenuItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      menuOpen: false,
      displayName: window.localStorage.getItem('username')
    }

    this.element = React.createRef()

    this.handleMenuToggle = this.handleMenuToggle.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleDocumentClick = this.handleDocumentClick.bind(this)
  }

  refreshPage() {
    window.location.reload()
  }

  handleDocumentClick(event) {
    if (
      this.state.menuOpen &&
      !event.target.closest(`#${this.element.current.id}`) &&
      window.matchMedia('(min-width: 801px)').matches
    ) {
      event.preventDefault()
      this.setState({
        menuOpen: false
      })
    }
  }

  componentDidMount() {
    if (isAuthenticated()) {
      const user = getUserProfile(getToken())
      this.setState({ user: user })

      // Hacky way to hide For Schools nav item
      const forSchoolsEl = document.querySelector(
        '.heading--nav-item[href="/schools"]'
      )

      forSchoolsEl.remove()
    }

    document.addEventListener('click', this.handleDocumentClick)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick)
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
    const { menuOpen, user, displayName } = this.state
    return (
      <Fragment>
        {!user ? (
          <div ref={this.element} className={styles.joinButtons}>
            <a
              className={classnames(styles.joinButton, styles.loginButton)}
              href="/account/login">
              Login
            </a>
            <a className={styles.joinButton} href="/account/signup">
              Sign Up
            </a>
          </div>
        ) : (
          <div ref={this.element} id="user-menu-item">
            <div
              className={classnames(styles.userName, styles.hiddenOnMobile)}
              onClick={this.handleMenuToggle}>
              {displayName || user.username}
              <UserIcon />
            </div>
            <div
              className={classnames(
                styles.mobileUserLinks,
                styles.hiddenOnDesktop
              )}>
              <a href="/account/dashboard">Dashboard</a>
              <br />
              <a href="/account/dashboard/#orders-section">My Orders</a>
              <div className={styles.divider} />
              <button className={styles.logoutLink} onClick={this.handleLogout}>
                Logout
              </button>
            </div>
            {menuOpen && (
              <div className={styles.overlay}>
                <div className={styles.navLinks}>
                  <p>
                    <a
                      href="/account/dashboard/#orders-section"
                      onClick={this.refreshPage.bind(this)}>
                      My Orders
                    </a>
                  </p>
                  <p>
                    <a href="/account/dashboard">Dashboard</a>
                  </p>
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
      </Fragment>
    )
  }
}

export default UserMenuItem
