import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import EmailSettings from './EmailSettings'
import { fetchWidgetSettings, updateWidgetSettings } from 'store/settings'

class EmailSettingsContainer extends React.Component {
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
    return <EmailSettings {...this.props} />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    loading: state.settings.widget.loading,
    saving: state.settings.widget.saving,
    settings: state.settings.widget.settings,
    error: state.settings.widget.error
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchWidgetSettings,
      updateWidgetSettings
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailSettingsContainer)
