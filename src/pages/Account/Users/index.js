import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Users from './Users'
import { getUsers, editUser, newUser, deleteUser } from 'store/user'

class UsersContainer extends React.Component {
  componentDidMount() {
    // this.props.getUsers(this.props.schoolId)
  }

  render() {
    const { loading } = this.props
    if (loading) {
      return <div>Loading...</div>
    }
    return <Users {...this.props} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    saving: state.user.saving,
    users: state.user.users,
    selectedUser: state.user.selectedUser,
    error: state.user.error
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUsers,
      editUser,
      newUser,
      deleteUser
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersContainer)
