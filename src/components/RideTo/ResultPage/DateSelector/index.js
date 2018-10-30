import React, { Component } from 'react'
import moment from 'moment'
import classnames from 'classnames'
import { SINGLE_DAY_IN_SECONDS } from 'common/constants'
import styles from './styles.scss'
import DateItem from './DateItem'
import Loading from 'components/Loading'

class DateSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: new Date(),
      daysCount: 12,
      loadingDates: false
    }
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
  }

  updateDimensions() {
    let daysCount = parseInt(
      (this.refs.dateSelectorContainer.offsetWidth - 120) / 94,
      10
    )
    this.setState({ daysCount: daysCount })
  }

  handleClickPrev() {
    const { startDate, daysCount } = this.state
    let date = new Date(
      startDate.getTime() - SINGLE_DAY_IN_SECONDS * 1000 * daysCount
    )
    let today = moment().startOf('day')
    let newPrevDate = moment(date).startOf('day')
    if (newPrevDate < today) return
    this.setState({ startDate: date, loadingDates: true })
  }

  handleClickNext() {
    const { startDate, daysCount } = this.state
    let date = new Date(
      startDate.getTime() + SINGLE_DAY_IN_SECONDS * 1000 * daysCount
    )
    this.setState({ startDate: date, loadingDates: true })
  }

  render() {
    const { startDate, daysCount, loadingDates } = this.state
    const { date, handleSetDate, className } = this.props
    return (
      <div
        className={classnames(styles.dateSelector, className)}
        ref="dateSelectorContainer">
        <div className={styles.prev} onClick={this.handleClickPrev.bind(this)}>
          <i className="fa fa-angle-left" aria-hidden="true" />
        </div>
        <Loading loading={loadingDates}>
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
                key={index}
              />
            ))}
          </div>
        </Loading>
        <div className={styles.next} onClick={this.handleClickNext.bind(this)}>
          <i className="fa fa-angle-right" aria-hidden="true" />
        </div>
      </div>
    )
  }
}

export default DateSelector
