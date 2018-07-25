import React from "react";
import classNames from "classnames";
import styles from "./styles.scss";

const Loading = props => {
  return (
    <div className={classNames(props.loading && styles.loadingMask)}>
      {props.children}
    </div>
  );
};

export default Loading;
