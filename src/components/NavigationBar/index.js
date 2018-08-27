import React from 'react'
import { NavLink } from 'react-router-dom'
// import Header from '../Header'
// import UserMenu from '../UserMenu'
import classnames from 'classnames'
import styles from './styles.scss'
import IconRideToLogo from '../../assets/icons/IconRideToLogo'

let NavigationBar = ({ history }) => {
  return (
    // <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
    //   <a class="navbar-brand" href="#">Top navbar</a>
    //   <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
    //     <span class="navbar-toggler-icon"></span>
    //   </button>
    //   <div class="navbar-collapse collapse" id="navbarCollapse">
    //     <ul class="navbar-nav mr-auto">
    //       <li className="nav-item active">
    //         <NavLink
    //           className={styles.navLink}
    //           activeClassName={styles.activeNavLink}
    //           exact
    //           to="/">
    //           Home
    //         </NavLink>
    //       </li>
    //       <li className="nav-item">
    //         <NavLink
    //           className={styles.navLink}
    //           activeClassName={styles.activeNavLink}
    //           to="/orders">
    //           Orders
    //         </NavLink>
    //       </li>
    //       <li className="nav-item">
    //         <NavLink
    //           className={styles.navLink}
    //           activeClassName={styles.activeNavLink}
    //           to="/calendar">
    //           Calendar
    //         </NavLink>
    //       </li>
    //     </ul>
    //   </div>
    // </nav>
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
      </div>
    </nav>
    // <Header>
    //   <div className={styles.container}>
    //     <div className={styles.navLinks}>
    // <NavLink
    //   className={styles.navLink}
    //   activeClassName={styles.activeNavLink}
    //   exact
    //   to="/">
    //   Home
    // </NavLink>
    // <NavLink
    //   className={styles.navLink}
    //   activeClassName={styles.activeNavLink}
    //   to="/orders">
    //   Orders
    // </NavLink>
    // <NavLink
    //   className={styles.navLink}
    //   activeClassName={styles.activeNavLink}
    //   to="/calendar">
    //   Calendar
    // </NavLink>
    //     </div>
    //     <div className={styles.authMenu}>
    //       <UserMenu history={history} />
    //     </div>
    //   </div>
    // </Header>
  )
}

export default NavigationBar
