import React from "react";
import classNames from "classnames";
import styles from "./styles.scss";

const CalendarIconOk = props => {
  return (
    <div className={styles.container}>
      <h1>Alright! no pending orders!</h1>
      <div className={classNames(styles.calendarContainer, styles.calendar)}>
        <div className={styles.checkmark} />
      </div>
    </div>
  );
};

export default CalendarIconOk;
