import React, { Component } from "react";
import { connect } from "react-redux";
// import { withRouter } from 'react-router-dom'
import { logout } from "actions";
import { changeSchool } from "scenes/Login/actions";
import styles from "./styles.scss";

class UserMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleSupplierChange = this.handleSupplierChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.node && !this.node.contains(event.target)) {
      this.setState({ menuOpen: false });
    }
  }

  toggleMenu() {
    this.setState(prevState => {
      return { menuOpen: !prevState.menuOpen };
    });
  }

  handleLogout(e) {
    if (window.confirm("Are you sure that you whant to logout?")) {
      this.props.logout();
      this.props.history.push("/");
    } else {
      this.toggleMenu();
    }
  }

  handleSupplierChange(e) {
    console.log(e);
    this.props.changeSchool(
      e.target.value,
      e.target.options[e.target.selectedIndex].innerText
    );
    this.toggleMenu();
  }

  render() {
    let { user, schoolId } = this.props;
    return (
      localStorage.getItem("token") && (
        <div className={styles.container}>
          <div className={styles.username} onClick={this.toggleMenu}>
            {user.email}
          </div>
          {this.state.menuOpen && (
            <div ref={node => (this.node = node)} className={styles.userMenu}>
              <br />
              <button onClick={this.handleLogout}>Logout</button>
              <br />
              <br />
              <select
                value={schoolId}
                onChange={e => this.handleSupplierChange(e)}
              >
                {user.suppliers.map(supplier => (
                  <option
                    key={supplier.id}
                    value={supplier.id}
                    name={supplier.name}
                  >
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )
    );
  }
}
export default connect(
  state => ({
    user: state.login.session.user,
    schoolId: state.login.schoolId,
    schoolName: state.login.schoolName
  }),
  dispatch => ({
    logout: () => dispatch(logout()),
    changeSchool: (schoolId, schoolName) =>
      dispatch(changeSchool(schoolId, schoolName))
  })
)(UserMenu);
