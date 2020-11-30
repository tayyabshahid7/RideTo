import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logout, changeSchool } from 'store/auth'
import { IconLogout } from '../../assets/icons'
import styles from './styles.scss'

class UserMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuOpen: false
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
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
    if (window.confirm('Are you sure that you want to logout?')) {
      this.props.logout()
      this.props.history.push('/')
    } else {
      this.toggleMenu()
    }
  }

  render() {
    let { user } = this.props
    return (
      user && (
        <div className={styles.container}>
          <div className={styles.avatar} onClick={this.toggleMenu}>
            {user.name.charAt(0) || user.first_name.charAt(0)}
          </div>
          {this.state.menuOpen && (
            <div ref={node => (this.node = node)} className={styles.userMenu}>
              <div
                className={styles.logoutLink}
                color="link"
                onClick={this.handleLogout}>
                <IconLogout />
                Logout
              </div>
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
    schoolName: state.auth.schoolName
  }),
  dispatch => ({
    logout: () => dispatch(logout()),
    changeSchool: (schoolId, schoolName) =>
      dispatch(changeSchool(schoolId, schoolName))
  })
)(UserMenu)
