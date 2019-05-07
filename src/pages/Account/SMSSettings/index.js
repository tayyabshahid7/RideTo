import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SMSSettings from './SMSSettings'
import { fetchCredits, purchaseCredits } from 'store/sms'

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.sms.loading,
    credit_unit: state.sms.credit_unit,
    sms_credit: state.sms.sms_credit
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchCredits,
      purchaseCredits
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SMSSettings)
