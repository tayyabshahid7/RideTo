import React from 'react'
import { NavLink } from 'react-router-dom'
// import Header from '../Header'
import UserMenu from '../UserMenu'
import classnames from 'classnames'
import styles from './styles.scss'
import IconRideToLogo from '../../assets/icons/IconRideToLogo'

let NavigationBar = ({ history }) => {
  return (
    <nav
      className={classnames(
        'navbar navbar-expand-md navbar-light bg-light fixed-top'
      )}>
      <div className={classnames(styles.image)}>
        <IconRideToLogo className={classnames(styles.logoImage)} />
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
          <li className="nav-item active">
            <NavLink
              className={styles.navLink}
              activeClassName={styles.activeNavLink}
              exact
              to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={styles.navLink}
              activeClassName={styles.activeNavLink}
              to="/orders">
              Orders
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={styles.navLink}
              activeClassName={styles.activeNavLink}
              to="/calendar">
              Calendar
            </NavLink>
          </li>
        </ul>
        <form class={classnames('form-inline my-2 my-lg-0', styles.authMenu)}>
          <UserMenu history={history} />
        </form>
      </div>
    </nav>
  )
}

export default NavigationBar
