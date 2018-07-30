import React, { Component } from 'react'
import moment from 'moment'
import styles from './index.scss'
import classnames from 'classnames'

class CalendarWeekView extends Component {
  // renderHeader() {
  //   const { days } = this.props
  //   return (
  //     <ul className={styles.container}>
  //       {days.map(date => <li>{moment(date).format('ddd D')}</li>)}
  //     </ul>
  //   )
  // }
  renderTimeline() {
    return (
      <div className={styles.timeline}>
        <ul>
          <li>
            <span>09:00</span>
          </li>
          <li>
            <span>09:30</span>
          </li>
          <li>
            <span>10:00</span>
          </li>
          <li>
            <span>10:30</span>
          </li>
          <li>
            <span>11:00</span>
          </li>
          <li>
            <span>11:30</span>
          </li>
          <li>
            <span>12:00</span>
          </li>
          <li>
            <span>12:30</span>
          </li>
          <li>
            <span>13:00</span>
          </li>
          <li>
            <span>13:30</span>
          </li>
          <li>
            <span>14:00</span>
          </li>
          <li>
            <span>14:30</span>
          </li>
          <li>
            <span>15:00</span>
          </li>
          <li>
            <span>15:30</span>
          </li>
          <li>
            <span>16:00</span>
          </li>
          <li>
            <span>16:30</span>
          </li>
          <li>
            <span>17:00</span>
          </li>
          <li>
            <span>17:30</span>
          </li>
          <li>
            <span>18:00</span>
          </li>
        </ul>
      </div>
    )
  }
  renderDays() {
    const { days } = this.props
    return (
      <div className={styles.events}>
        <ul>
          {days.map(day => (
            <li className={styles.eventsGroup}>
              <div className={styles.topInfo}>
                <span>{moment(day.date).format('ddd D')}</span>
              </div>
              <ul>
                <li
                  className={styles.singleEvent}
                  data-start="09:30"
                  data-end="10:30"
                  data-content="event-abs-circuit"
                  data-event="event-1">
                  <a href="#0">
                    <span className={styles.eventDate}>09:30 - 10:30</span>
                    <em className={styles.eventName}>Abs Circuit</em>
                  </a>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  render() {
    let { days, calendar } = this.props
    return (
      <div className={styles.container}>
        {this.renderTimeline()}
        {this.renderDays()}
      </div>
    )
  }
}

export default CalendarWeekView
