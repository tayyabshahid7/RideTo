import SchoolSelect from './SchoolSelect'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { changeSchool } from 'store/auth'

const mapStateToProps = (state, ownProps) => {
  return {
    schools: state.auth.user.suppliers,
    selected: state.auth.schoolId
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onChange: changeSchool
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchoolSelect)
