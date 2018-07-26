import React, { Component } from "react";

class Table extends Component {
  render() {
    return (
      <div className="pending-orders-table">
        <table>
          <thead>
            <tr>
              <th />
              <th>
                Order #<span onClick={e => this.porps.sortingChange(e)}>X</span>
              </th>
              <th>Date Requested</th>
              <th>Bike Type</th>
              <th>School location</th>
            </tr>
          </thead>
          <tbody>
            {this.props.orders.map((order, index) => (
              <tr
                className={index % 2 ? "trEven" : "trOdd"}
                key={order.friendly_id}
              >
                <td>
                  <a
                    className="respondLink"
                    href={`${order.school_confirm_url}`}
                    target="_blank"
                  >
                    Respond
                  </a>
                </td>
                <td>{order.friendly_id}</td>
                <td>{order.user_date}</td>
                <td>
                  {order.bike_hire === "auto"
                    ? "Automatic"
                    : order.bike_hire === "manual"
                      ? "Manual"
                      : "None"}
                </td>
                <td>{order.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
