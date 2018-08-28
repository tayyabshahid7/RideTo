import MinimalSelect from 'components/MinimalSelect'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { changeSchool } from 'store/auth'

const mapStateToProps = (state, ownProps) => {
  return {
    options: state.auth.user.suppliers,
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
)(MinimalSelect)
