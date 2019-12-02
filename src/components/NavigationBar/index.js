import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import UserMenu from '../UserMenu'
import classnames from 'classnames'
import styles from './styles.scss'
import { ConnectLogo } from '../../assets/icons/'
import { connect } from 'react-redux'
import { isAdmin } from 'services/auth'
import SchoolSelect from 'components/SchoolSelect'
import MediaQuery from 'react-responsive'
import { logout } from 'store/auth'
import { useMediaQuery } from 'react-responsive'

let NavigationBar = ({ history, user, logout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const { pathname } = history.location
  const [, first, second] = pathname.split('/')
  let date

  if (
    first &&
    first === 'calendar' &&
    second &&
    second.match(/\d{4}-\d{2}-\d{2}/)
  ) {
    date = second
  }

  function handleLogout() {
    if (window.confirm('Are you sure that you whant to logout?')) {
      logout()
      history.push('/')
    }
  }

  function handleButtonClick() {
    setIsOpen(prevIsOpen => !prevIsOpen)
  }

  return (
    <nav
      className={classnames(
        styles.navigationBar,
        // 'navbar navbar-expand-md navbar-light bg-light fixed-top'
        'navbar navbar-expand-md navbar-light fixed-top',
        isOpen && styles.isOpen
      )}>
      <div className={classnames(styles.image)}>
        {isOpen && isMobile ? (
          <div className={styles.avatar}>
            {user.name.charAt(0) || user.first_name.charAt(0)}
          </div>
        ) : (
          <Link to="/">
            <ConnectLogo className={classnames(styles.logoImage)} />
          </Link>
        )}
      </div>
      <MediaQuery maxWidth={768}>
        <div className={styles.schoolSelect}>
          <SchoolSelect />
        </div>
      </MediaQuery>
      <button
        onClick={handleButtonClick}
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <ul className={classnames('navbar-nav mr-auto', styles.navbar)}>
          <MediaQuery minWidth={768}>
            <li className={classnames('nav-item', styles.navItem)}>
              <NavLink
                className={styles.navLink}
                activeClassName={styles.activeNavLink}
                exact
                to="/">
                Home
              </NavLink>
            </li>
          </MediaQuery>
          <li className={classnames('nav-item', styles.navItem)}>
            <NavLink
              className={styles.navLink}
              activeClassName={styles.activeNavLink}
              to="/orders">
              Orders
            </NavLink>
          </li>
          <li className={classnames('nav-item', styles.navItem)}>
            <NavLink
              className={styles.navLink}
              activeClassName={styles.activeNavLink}
              to="/calendar">
              Calendar
            </NavLink>
          </li>
          <li className={classnames('nav-item', styles.navItem)}>
            <NavLink
              className={styles.navLink}
              activeClassName={styles.activeNavLink}
              to="/customers">
              Customers
            </NavLink>
          </li>
          {isAdmin(user) && (
            <li className={classnames('nav-item', styles.navItem)}>
              <NavLink
                className={styles.navLink}
                activeClassName={styles.activeNavLink}
                to="/account/availability">
                Account
              </NavLink>
            </li>
          )}
          <MediaQuery maxWidth={768}>
            <li className={classnames('nav-item', styles.navItem)}>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Log out
              </button>
            </li>
          </MediaQuery>
        </ul>
        <MediaQuery minWidth={768}>
          <div className={styles.navTools}>
            {isAdmin(user) && (
              <Link
                to={
                  date
                    ? `/calendar/courses/create?date=${date}`
                    : `/calendar/courses/create`
                }
                className={classnames(styles.addCourse)}>
                Add Course
              </Link>
            )}
            <form
              className={classnames(
                'form-inline my-2 my-lg-0',
                styles.authMenu
              )}>
              <UserMenu history={history} />
            </form>
          </div>
        </MediaQuery>
      </div>
    </nav>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  }
}
export default withRouter(
  connect(
    mapStateToProps,
    dispatch => ({
      logout: () => dispatch(logout())
    })
  )(NavigationBar)
)
