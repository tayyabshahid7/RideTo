import React, { Component } from "react";

class Notifications extends Component {
  render() {
    return (
      <div className="notifications">
        <h1>Notifications - {this.props.schoolName} </h1>
        <h2>Pending Orders</h2>
      </div>
    );
  }
}

export default Notifications;
