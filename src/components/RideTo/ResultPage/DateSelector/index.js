import React, { Component } from 'react'
import classnames from 'classnames'
import { SINGLE_DAY_IN_SECONDS } from 'common/constants'
import styles from './styles.scss'
import DateItem from './DateItem'

class DateSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: new Date(this.props.date),
      daysCount: 12
    }
  }

  handleClickPrev() {
    const { startDate, daysCount } = this.state
    let date = new Date(
      startDate.getTime() - SINGLE_DAY_IN_SECONDS * 1000 * daysCount
    )
    this.setState({ startDate: date })
  }

  handleClickNext() {
    const { startDate, daysCount } = this.state
    let date = new Date(
      startDate.getTime() + SINGLE_DAY_IN_SECONDS * 1000 * daysCount
    )
    this.setState({ startDate: date })
  }

  render() {
    const { startDate, daysCount } = this.state
    const { date, handleSetDate, className } = this.props
    return (
      <div className={classnames(styles.dateSelector, className)}>
        <div className={styles.prev} onClick={this.handleClickPrev.bind(this)}>
          <i className="fa fa-angle-left" aria-hidden="true" />
        </div>
        <div className={styles.dates}>
          {Array.apply(null, { length: daysCount }).map((val, index) => (
            <DateItem
              date={
                new Date(
                  startDate.getTime() + SINGLE_DAY_IN_SECONDS * 1000 * index
                )
              }
              activeDate={date}
              showMonth={index === 0}
              handleSetDate={handleSetDate}
              kye={index}
            />
          ))}
        </div>
        <div className={styles.next} onClick={this.handleClickNext.bind(this)}>
          <i className="fa fa-angle-right" aria-hidden="true" />
        </div>
      </div>
    )
  }
}

export default DateSelector
