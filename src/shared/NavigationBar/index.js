import React from 'react';
import { NavLink } from 'react-router-dom'
import styles from './styles.scss';
import Header from 'shared/Header'
import UserMenu from 'shared/UserMenu'

let NavigationBar = () =>  {
  return (
    <Header>
        <div className={styles.container}>
            <div className={styles.navLinks}>
                <NavLink className={styles.navLink} activeClassName={styles.activeNavLink} exact to="/">Home</NavLink>
                <NavLink className={styles.navLink} activeClassName={styles.activeNavLink} to="/orders">Orders</NavLink>
            </div>
            <div className={styles.authMenu}>
                <UserMenu/>
            </div>
        </div>
    </Header>
  )
}

export default NavigationBar