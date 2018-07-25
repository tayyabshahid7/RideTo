import React, { Component } from "react";

class Modal extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    // Put here any api calls to the backend
  }

  closeModal(e) {
    e && e.stopPropagation();
    this.props.history.goBack();
  }

  render() {
    return (
      <div className="modal-wrapper">
        <div className="modal">
          <div className="modalHeader">
            <div className="modalTitle">TITLE</div>
            <div className="modalCloseButton" onClick={this.closeModal}>
              x
            </div>
          </div>
          <div className="modalBody">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="modalFooter">
            <div className="modalActionButtons">
              <button
                type="button"
                className="button"
                onClick={this.closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Place this <Router path="[link path]" component={Modal}/>
// <Link to={'[path-here]'}>[text here]</Link>
export default Modal;
