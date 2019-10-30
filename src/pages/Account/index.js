import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AccountPage from './AccountPage'
import { isAdmin } from 'services/auth'

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    isAdmin: isAdmin(state.auth.user)
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountPage)
