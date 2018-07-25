import React, { Component } from "react";
import styles from "./styles.scss";
import Loading from "../../../../components/Loading";

class ConfirmedOrders extends Component {
  checkCancelledOrRejected(order) {
    if (order.cancelled || order.booking_status !== "SCHOOL_CONFIRMED_BOOK") {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div className={styles.container}>
        {
          <div>
            <Loading loading={this.props.loading}>
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Training Date</th>
                    <th>Course</th>
                    <th>Bike Hire</th>
                    <th>Rider Name</th>
                    <th>Mobile #</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.confirmedOrders.results.map(order => (
                    <tr key={order.friendly_id}>
                      <td>{order.friendly_id}</td>
                      <td>
                        {this.checkCancelledOrRejected(order)
                          ? order.user_date
                          : order.start_time}
                      </td>
                      <td>
                        {order.selected_licence === "LICENCE_CBT"
                          ? "CBT Training "
                          : "CBT Renewal"}
                      </td>
                      <td>
                        {order.bike_hire === "auto"
                          ? "Automatic"
                          : order.bike_hire === "manual"
                            ? "Manual"
                            : "None"}
                      </td>
                      <td>
                        {this.checkCancelledOrRejected(order)
                          ? "-"
                          : order.user_name}
                      </td>
                      <td>
                        {this.checkCancelledOrRejected(order)
                          ? "-"
                          : order.user_phone}
                      </td>
                      <td>
                        {order.cancelled
                          ? "Cancelled"
                          : order.booking_status === "SCHOOL_CONFIRMED_BOOK"
                            ? "Confirmed"
                            : "Rejected"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Loading>
          </div>
        }
      </div>
    );
  }
}

export default ConfirmedOrders;
