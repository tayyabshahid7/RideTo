import React from 'react';
import styles from './styles.scss'
import classNames from 'classnames'

const CalendarIconOk = (props) => {
    return (
        <div className={styles.container}>
            <h1>Alright! no pending orders!</h1>
            <div className={classNames(styles.calendarContainer, styles.calendar)}>
                <div className={styles.checkmark}></div>
            </div>
        </div>
    )
}


export default CalendarIconOk



