import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Instructors from './Instructors'
import {
  getInstructors,
  editInstructor,
  newInstructor,
  deleteInstructor
} from 'store/instructor'

class InstructorsContainer extends React.Component {
  componentDidMount() {
    this.props.getInstructors(this.props.schoolId)
  }

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
    schoolId: state.auth.schoolId,
    saving: state.instructor.saving,
    instructors: state.instructor.instructors,
    error: state.instructor.error
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getInstructors,
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
