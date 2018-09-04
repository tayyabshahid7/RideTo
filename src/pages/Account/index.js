import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AccountPage from './AccountPage'

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountPage)
