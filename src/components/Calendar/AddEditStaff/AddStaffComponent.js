import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

function AddStaffComponent() {
  return <div>hello</div>
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    schools: state.auth.user.suppliers,
    saving: state.event.single.saving,
    event: state.event.single.event,
    error: state.event.single.error,
    pricing: state.event.pricing,
    info: state.info
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddStaffComponent)
