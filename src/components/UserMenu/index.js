import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logout, changeSchool } from 'store/auth'
import styles from './styles.scss'

import SchoolSelect from 'components/SchoolSelect'

class UserMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.handleSupplierChange = this.handleSupplierChange.bind(this)
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside(event) {
    if (this.node && !this.node.contains(event.target)) {
      this.setState({ menuOpen: false })
    }
  }

  toggleMenu() {
    this.setState(prevState => {
      return { menuOpen: !prevState.menuOpen }
    })
  }

  handleLogout(e) {
    if (window.confirm('Are you sure that you whant to logout?')) {
      this.props.logout()
      this.props.history.push('/')
    } else {
      this.toggleMenu()
    }
  }

  handleSupplierChange(schoolId, schoolName) {
    this.props.changeSchool(schoolId, schoolName)
    this.toggleMenu()
  }

  render() {
    let { user, schoolId } = this.props
    return (
      user && (
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
              <SchoolSelect
                schools={user.suppliers}
                selected={schoolId}
                onChange={this.handleSupplierChange}
              />
            </div>
          )}
        </div>
      )
    )
  }
}
export default connect(
  state => ({
    user: state.auth.user,
    schoolId: state.auth.schoolId,
    schoolName: state.auth.schoolName
  }),
  dispatch => ({
    logout: () => dispatch(logout()),
    changeSchool: (schoolId, schoolName) =>
      dispatch(changeSchool(schoolId, schoolName))
  })
)(UserMenu)
