import React from "react";
import blackRideTologo from "../../assets/images/rideto-black.png";
import whiteRideTologo from "../../assets/images/rideto-white.png";

const Header = ({ dark, children }) => {
  return (
    <div className={`header-component ${dark ? "dark" : ""}`}>
      <div className="logo">
        {dark ? (
          <img src={whiteRideTologo} alt="RideTo logo" />
        ) : (
          <img src={blackRideTologo} alt="RideTo logo" />
        )}
      </div>
      <div className="title">{children}</div>
    </div>
  );
};

export default Header;
