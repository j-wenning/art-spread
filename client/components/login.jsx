import React from 'react';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoggingIn: false };
  }

  handleLogin(id) {
    const pass = 'Password123!';
    let user = null;
    switch (id) {
      case 1:
        user = 'user1';
        break;
      case 2:
        user = 'user2';
        break;
      case 3:
        user = 'user3';
        break;
      default:
        return;
    }
    this.props.login(user, pass);
  }

  render() {
    return (
      <div className="login container d-flex vh-100 text-center justify-content-center align-items-center">
        <div>
          <h1 className="text-brand text-capitalize">Art Spread</h1>
          {!this.state.isLoggingIn && (
            <button
              onClick={() => this.setState({ isLoggingIn: true })}
              className="btn btn-custom text-capitalize mt-5">
              log in
            </button>
          )}
          {this.state.isLoggingIn && (
            <div className="dropdown">
              <button
                className="btn btn-custom dropdown-toggle d-flex justify-content-between align-items-center text-capitalize mt-5 mx-auto"
                type="button"
                id="loginDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                accounts
              </button>
              <div
                className="dropdown-menu p-0"
                aria-labelledby="loginDropdown">
                <a
                  onClick={() => this.handleLogin(1)}
                  className="dropdown-item border-bottom">
                  account 1
                </a>
                <a
                  onClick={() => this.handleLogin(2)}
                  className="dropdown-item border-bottom">
                  account 2
                </a>
                <a
                  onClick={() => this.handleLogin(3)}
                  className="dropdown-item border-bottom">
                  account 3
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
