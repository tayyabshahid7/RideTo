import React from "react";

const Loading = props => {
  return (
    <div className={props.loading ? "loadingMask" : ""}>{props.children}</div>
  );
};

export default Loading;
