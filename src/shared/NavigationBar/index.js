import React from 'react';
import { NavLink } from 'react-router-dom'
import styles from './styles.scss';
import Header from 'shared/Header'

let NavigationBar = () =>  {
  return (
    <Header>
        <nav>
            <NavLink className={styles.navLink} activeClassName={styles.activeNavLink} to="/dashboard">Home</NavLink>
            <NavLink className={styles.navLink} activeClassName={styles.activeNavLink} to="/orders">Orders</NavLink>
        </nav>
    </Header>
  )
}

export default NavigationBar