import React from 'react'
import moment from 'moment'
import MaskedInput from 'react-maskedinput'

class DateInput extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const { id, onError, onChange, isPrevCbt } = this.props
    const { value } = event.target

    onChange(id, value)

    if (isPrevCbt) {
      const result = this.isValidCbtPrevDate(value)
      if (result) {
        onError(id, result)
      }
    } else if (!this.isValid(value)) {
      onError(id)
    }
  }

  isValidCbtPrevDate(dateString) {
    let trainingDate = moment(this.props.trainingDate, 'YYYY-MM-DD')

    const date = moment(dateString, 'DD/MM/YYYY')
    const isComplete = dateString.slice(-1) !== '_'

    if (!isComplete || !date.isValid()) {
      return 'invalid'
    }

    if (moment().isBefore(date)) {
      return 'future'
    }

    if (trainingDate.diff(date, 'years', true) > 2) {
      return 'over'
    }

    return ''
  }

  isValid(value) {
    const { today, minYears, maxYears, trainingDate } = this.props
    const date = moment(value, 'DD/MM/YYYY')
    const isComplete = value.slice(-1) !== '_'

    if (trainingDate) {
      const dateOfTraining = moment(trainingDate, 'YYYY-MM-DD')
      if (isComplete && minYears && maxYears) {
        return (
          dateOfTraining.diff(date, 'years') >= minYears &&
          dateOfTraining.diff(date, 'years') < maxYears
        )
      }
      if (isComplete && minYears) {
        return dateOfTraining.diff(date, 'years') >= minYears
      }
    } else if (isComplete && minYears && maxYears && today) {
      return (
        today.diff(date, 'years') > minYears &&
        today.diff(date, 'years') < maxYears
      )
    } else if (isComplete && minYears && today) {
      return today.diff(date, 'years') > minYears
    }

    return isComplete || date.isValid()
  }

  render() {
    const { value } = this.props
    return (
      <MaskedInput
        value={value}
        mask="11/11/1111"
        placeholder="DD/MM/YYYY"
        size="7"
        onChange={this.handleChange}
      />
    )
  }
}

export default DateInput
