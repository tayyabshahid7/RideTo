import React from "react";
import { NavLink } from "react-router-dom";
import Header from "../Header";
import UserMenu from "../UserMenu";

let NavigationBar = ({ history }) => {
  return (
    <Header>
      <div className="navigation-bar">
        <div className="navLinks">
          <NavLink
            className="navLink"
            activeClassName="activeNavLink"
            exact
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className="navLink"
            activeClassName="activeNavLink"
            to="/orders"
          >
            Orders
          </NavLink>
          <NavLink
            className="navLink"
            activeClassName="activeNavLink"
            to="/calendar"
          >
            Calendar
          </NavLink>
        </div>
        <div className="authMenu">
          <UserMenu history={history} />
        </div>
      </div>
    </Header>
  );
};

export default NavigationBar;
