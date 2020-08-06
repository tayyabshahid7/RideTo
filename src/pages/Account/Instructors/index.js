import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Instructors from './Instructors'
import {
  editInstructor,
  newInstructor,
  deleteInstructor
} from 'store/instructor'

class InstructorsContainer extends React.Component {
  render() {
    const { loading } = this.props
    if (loading) {
      return <div>Loading...</div>
    }
    return <Instructors {...this.props} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    saving: state.instructor.saving,
    instructors: state.instructor.instructors,
    suppliers: state.auth.user.suppliers,
    error: state.instructor.error
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      editInstructor,
      newInstructor,
      deleteInstructor
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstructorsContainer)
