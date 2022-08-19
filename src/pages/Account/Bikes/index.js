import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Bikes from './Bikes'

function BikesContainer(props) {
  console.log(props)

  return <Bikes {...props} />
}

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BikesContainer)
