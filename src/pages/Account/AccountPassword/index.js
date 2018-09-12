import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AccountPassword from './AccountPassword'
import { updatePassword } from 'store/auth'
import { actions as notificationActions } from 'store/notification'

const mapStateToProps = (state, ownProps) => {
  return {
    saving: state.auth.saving,
    error: state.auth.error
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updatePassword,
      showNotification: notificationActions.showNotification
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountPassword)
