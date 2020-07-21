import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import UserMenu from '../UserMenu'
import classnames from 'classnames'
import styles from './styles.scss'
import { IconClose, IconMenu } from '../../assets/icons/'
import Logo from 'components/common/Logo'
import { connect } from 'react-redux'
import { isAdmin } from 'services/auth'
import MediaQuery from 'react-responsive'
import { logout } from 'store/auth'
import { useMediaQuery } from 'react-responsive'
import { Mobile } from 'common/breakpoints'
import $ from 'jquery'

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

  useEffect(() => {
    $('#navbarCollapse').on('show.bs.collapse', function() {
      setIsOpen(true)
    })

    $('#navbarCollapse').on('hide.bs.collapse ', function() {
      setIsOpen(false)
    })
  }, [])

  return (
    <nav
      className={classnames(
        styles.navigationBar,
        'navbar navbar-expand-md navbar-light',
        isOpen && styles.isOpen
      )}>
      <div className={classnames(styles.image)}>
        {isOpen && isMobile ? <Logo /> : <Logo short />}
      </div>
      <Mobile>
        <div
          data-toggle="collapse"
          data-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation">
          {isOpen ? <IconClose /> : <IconMenu />}
        </div>
      </Mobile>
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
                to="/account/">
                Account
              </NavLink>
            </li>
          )}
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
                className={classnames(styles.navLink)}>
                Add Course
              </Link>
            )}
            <form className={styles.authMenu}>
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
