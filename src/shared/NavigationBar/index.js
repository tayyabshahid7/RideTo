import React from 'react';
import { NavLink } from 'react-router-dom'
import styles from './styles.scss';
import Header from 'shared/Header'
import AuthButton from 'shared/AuthButton'

let NavigationBar = () =>  {
  return (
    <Header>
        <div className={styles.container}>
            <div className={styles.navLinks}>
                <NavLink className={styles.navLink} activeClassName={styles.activeNavLink} to="/dashboard">Home</NavLink>
                <NavLink className={styles.navLink} activeClassName={styles.activeNavLink} to="/orders">Orders</NavLink>
            </div>
            <div className={styles.authMenu}>
                <AuthButton/>
            </div>
        </div>
    </Header>
  )
}

export default NavigationBar