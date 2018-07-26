import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CalendarMonthView from './CalendarMonthView'
import CalendarHeader from './CalendarHeader'

class CalendarComponent extends Component {
  render() {
    let { days, info } = this.props
    return (
      <div className="calendar-component">
        <CalendarHeader info={info} />
        <CalendarMonthView days={days} info={info} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarComponent)
