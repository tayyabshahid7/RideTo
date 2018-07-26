import React, { Component } from "react";

const Sorter = props => {
  return (
    props.direction && <div>{props.direction.startsWith("-") ? "⬆" : "⬇"}</div>
  );
};

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendly_id: null,
      user_date: null,
      bike_hire: null
    };
    this.handleSort = this.handleSort.bind(this);
  }

  _getSortingData() {
    const sortingData = Object.keys(this.state)
      .filter(c => this.state[c] !== null)
      .map(column => {
        if (this.state[column] !== null) {
          return this.state[column];
        }
        return undefined;
      });
    return sortingData.toString();
  }

  handleSort(e) {
    if (e.target) {
      const column = e.target.getAttribute("name");
      const shiftPressed = e.shiftKey;

      this.setState(
        prevState => {
          let newState = {};
          if (!shiftPressed) {
            newState = {
              friendly_id: null,
              user_date: null,
              bike_hire: null
            };
          }

          if (
            prevState[column] === null ||
            prevState[column] === `-${column}`
          ) {
            newState[column] = column;
          } else {
            newState[column] = "-" + column;
          }
          return newState;
        },
        () => {
          const sorting = this._getSortingData();
          this.props.sortingChange(sorting);
        }
      );
    }
  }

  render() {
    return (
      <div className="pending-orders-table">
        <table>
          <thead>
            <tr>
              <th />
              <th name="friendly_id" onClick={e => this.handleSort(e)}>
                Order # <Sorter direction={this.state.friendly_id} />
              </th>
              <th name="user_date" onClick={e => this.handleSort(e)}>
                Date Requested <Sorter direction={this.state.user_date} />
              </th>
              <th name="bike_hire" onClick={e => this.handleSort(e)}>
                Bike Type <Sorter direction={this.state.bike_hire} />
              </th>
              <th> School location </th>
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
