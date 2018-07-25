import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class CalendarPage extends Component {
  render() {
    return (
      <div className="page calendar-page">
        <div id="calendar-wrap">
          <header>
            <h1>December 2017</h1>
          </header>
          <div className="calendar" id="calendar">
            <ul className="weekdays">
              <li>Sunday</li>
              <li>Monday</li>
              <li>Tuesday</li>
              <li>Wednesday</li>
              <li>Thursday</li>
              <li>Friday</li>
              <li>Saturday</li>
            </ul>

            <ul className="days">
              <li className="day other-month">
                <div className="date">27</div>
              </li>
              <li className="day other-month">
                <div className="date">28</div>
                <div className="event">
                  <div className="event-desc">
                    HTML 5 lecture with Brad Traversy from Eduonix
                  </div>
                  <div className="event-time">1:00pm to 3:00pm</div>
                </div>
              </li>
              <li className="day other-month">
                <div className="date">29</div>
              </li>
              <li className="day other-month">
                <div className="date">30</div>
              </li>
              <li className="day other-month">
                <div className="date">31</div>
              </li>

              <li className="day">
                <div className="date">1</div>
              </li>
              <li className="day">
                <div className="date">2</div>
                <div className="event">
                  <div className="event-desc">
                    Career development @ Community College room #402
                  </div>
                  <div className="event-time">2:00pm to 5:00pm</div>
                </div>
              </li>
            </ul>

            <ul className="days">
              <li className="day">
                <div className="date">3</div>
              </li>
              <li className="day">
                <div className="date">4</div>
              </li>
              <li className="day">
                <div className="date">5</div>
              </li>
              <li className="day">
                <div className="date">6</div>
              </li>
              <li className="day">
                <div className="date">7</div>
                <div className="event">
                  <div className="event-desc">Group Project meetup</div>
                  <div className="event-time">6:00pm to 8:30pm</div>
                </div>
              </li>
              <li className="day">
                <div className="date">8</div>
              </li>
              <li className="day">
                <div className="date">9</div>
              </li>
            </ul>

            <ul className="days">
              <li className="day">
                <div className="date">10</div>
              </li>
              <li className="day">
                <div className="date">11</div>
              </li>
              <li className="day">
                <div className="date">12</div>
              </li>
              <li className="day">
                <div className="date">13</div>
              </li>
              <li className="day">
                <div className="date">14</div>
                <div className="event">
                  <div className="event-desc">Board Meeting</div>
                  <div className="event-time">1:00pm to 3:00pm</div>
                </div>
              </li>
              <li className="day">
                <div className="date">15</div>
              </li>
              <li className="day">
                <div className="date">16</div>
              </li>
            </ul>
            <ul className="days">
              <li className="day">
                <div className="date">17</div>
              </li>
              <li className="day">
                <div className="date">18</div>
              </li>
              <li className="day">
                <div className="date">19</div>
              </li>
              <li className="day">
                <div className="date">20</div>
              </li>
              <li className="day">
                <div className="date">21</div>
              </li>
              <li className="day">
                <div className="date">22</div>
                <div className="event">
                  <div className="event-desc">Conference call</div>
                  <div className="event-time">9:00am to 12:00pm</div>
                </div>
              </li>
              <li className="day">
                <div className="date">23</div>
              </li>
            </ul>
            <ul className="days">
              <li className="day">
                <div className="date">24</div>
              </li>
              <li className="day">
                <div className="date">25</div>
                <div className="event">
                  <div className="event-desc">Conference Call</div>
                  <div className="event-time">1:00pm to 3:00pm</div>
                </div>
              </li>
              <li className="day">
                <div className="date">26</div>
              </li>
              <li className="day">
                <div className="date">27</div>
              </li>
              <li className="day">
                <div className="date">28</div>
              </li>
              <li className="day">
                <div className="date">29</div>
              </li>
              <li className="day">
                <div className="date">30</div>
              </li>
            </ul>

            <ul className="days">
              <li className="day">
                <div className="date">31</div>
              </li>
              <li className="day other-month">
                <div className="date">1</div>
              </li>
              <li className="day other-month">
                <div className="date">2</div>
              </li>
              <li className="day other-month">
                <div className="date">3</div>
              </li>
              <li className="day other-month">
                <div className="date">4</div>
              </li>
              <li className="day other-month">
                <div className="date">5</div>
              </li>
              <li className="day other-month">
                <div className="date">6</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    schoolId: state.auth.schoolId,
    schoolName: state.auth.schoolName,
    confirmedOrders: state.orders.confirmedOrders,
    page: state.orders.page,
    loading: state.orders.loading
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarPage);
