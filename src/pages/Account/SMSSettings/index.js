import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SMSSettings from './SMSSettings'
import { fetchCredits, purchaseCredits } from 'store/sms'
import { fetchWidgetSettings, updateWidgetSettings } from 'store/settings'

class SMSSettingsContainer extends Component {
  componentDidMount() {
    const { fetchWidgetSettings, settings } = this.props
    if (!settings) {
      fetchWidgetSettings()
    }
  }

  render() {
    const { loading, settings } = this.props
    if (loading || !settings) {
      return <div>Loading...</div>
    }
    return <SMSSettings {...this.props} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    loading: state.settings.widget.loading,
    saving: state.settings.widget.saving,
    settings: state.settings.widget.settings,
    error: state.settings.widget.error,

    smsLoading: state.sms.loading,
    credit_unit: state.sms.credit_unit,
    sms_credit: state.sms.sms_credit
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchCredits,
      purchaseCredits,
      fetchWidgetSettings,
      updateWidgetSettings
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SMSSettingsContainer)
