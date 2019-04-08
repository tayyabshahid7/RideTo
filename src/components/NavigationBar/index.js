import React from 'react'
import { Link, NavLink } from 'react-router-dom'
// import Header from '../Header'
import UserMenu from '../UserMenu'
import classnames from 'classnames'
import styles from './styles.scss'
// import IconRideToLogo from '../../assets/icons/IconRideToLogo'
import { ConnectLogo } from '../../assets/icons/'
// import { Button } from 'reactstrap'

let NavigationBar = ({ history }) => {
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

  return (
    <nav
      className={classnames(
        styles.navigationBar,
        'navbar navbar-expand-md navbar-light bg-light fixed-top'
      )}>
      <div className={classnames(styles.image)}>
        <Link to="/">
          <ConnectLogo className={classnames(styles.logoImage)} />
        </Link>
      </div>
      <button
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
        <ul className="navbar-nav mr-auto">
          <li className={classnames('nav-item', styles.navItem)}>
            <NavLink
              className={styles.navLink}
              activeClassName={styles.activeNavLink}
              exact
              to="/">
              Home
            </NavLink>
          </li>
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
          <li className={classnames('nav-item', styles.navItem)}>
            <NavLink
              className={styles.navLink}
              activeClassName={styles.activeNavLink}
              to="/account/availability">
              Account
            </NavLink>
          </li>
        </ul>
        <div className={styles.navTools}>
          <Link
            to={
              date
                ? `/calendar/courses/create?date=${date}`
                : `/calendar/courses/create`
            }
            className={classnames(styles.addCourse)}>
            Add Course
          </Link>
          <form
            className={classnames('form-inline my-2 my-lg-0', styles.authMenu)}>
            <UserMenu history={history} />
          </form>
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar
