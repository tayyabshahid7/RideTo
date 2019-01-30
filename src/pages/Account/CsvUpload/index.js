import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CsvUpload from './CsvUpload'
import { uploadFile } from 'store/upload'
import { actions as notificationActions } from 'store/notification'

const mapStateToProps = (state, ownProps) => {
  return {
    saving: state.upload.saving,
    error: state.upload.error
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      uploadFile,
      showNotification: notificationActions.showNotification
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CsvUpload)
