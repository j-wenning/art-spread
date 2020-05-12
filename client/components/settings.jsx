import React from 'react';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changingUsername: false,
      changingPassword: false,
      addingAccount: false,
      accounts: []
    };
  }

  linkAccount(platform) {
    this.props.linkAccount(platform);
    const refresh = setInterval(() => {
      this.props.fetchAccounts()
        .then(data => {
          if (data.length !== this.state.accounts.length) {
            this.setState({ accounts: data });
            clearInterval(refresh);
          }
        })
        .catch(err => console.error(err));
    }, 2000);
    setTimeout(() => {
      clearInterval(refresh);
    }, 60000);
  }

  removeAccount(index) {
    this.props.removeAccount(index);
    this.setState(state => {
      state.accounts.splice(index, 1);
      return state;
    });
  }

  componentDidMount() {
    this.props.fetchAccounts()
      .then(data => this.setState({ accounts: data }))
      .catch(err => console.error(err));
  }

  render() {
    const accounts = this.state.accounts.map((item, index) => (
      <div key={index} className="account col-12">
        <div className="row p-2">
          <div
            className="btn-custom-menu d-flex justify-content-center align-items-center border-0">
            <h2 className="m-0 text-primary">
              <i className={`fab fa-${item.type}`} />
            </h2>
          </div>
          <div className="col">
            <p
              className="col-12 rounded-15 bg-primary text-center text-truncate text-primary p-3">
              {item.name}
            </p>
          </div>
          <button
            onClick={() => this.removeAccount(index)}
            type="button"
            className="btn btn-custom-menu border-0">
            <i className="fas fa-trash text-danger" />
          </button>
        </div>
      </div>
    ));
    const hasNoAccounts = !this.state.accounts.length;
    return (
      <div className="settings container text-center">
        {!this.state.changingUsername
          ? (
            <div className="col-12">
              <button
                onClick={() => this.setState({ changingUsername: true })}
                type="button"
                className="btn btn-custom text-capitalize">
                  change username
              </button>
            </div>
          )
          : (
            <div className="row">
              <div className="col-8">
                <input
                  type="text"
                  placeholder="Disabled for demo"
                  className="col-12 rounded border-secondary bg-primary p-3" />
              </div>
              <div
                className="col-4 d-flex justify-content-center align-items-center">
                <button
                  disabled
                  onClick={() => this.setState({ changingUsername: false })}
                  type="button"
                  className="btn btn-custom-no-width text-capitalize m-0">
                    submit
                </button>
              </div>
            </div>
          )}
        {!this.state.changingPassword
          ? (
            <div className="col-12">
              <button
                onClick={() => this.setState({ changingPassword: true })}
                type="button"
                className="btn btn-custom text-capitalize mt-2">
                  change password
              </button>
            </div>
          )
          : (
            <div className="row mt-2">
              <div className="col-8">
                <input
                  type="text"
                  placeholder="Disabled for demo"
                  className="col-12 rounded border-secondary bg-primary p-3" />
              </div>
              <div
                className="col-4 d-flex justify-content-center align-items-center">
                <button
                  disabled
                  onClick={() => this.setState({ changingPassword: false })}
                  type="button"
                  className="btn btn-custom-no-width text-capitalize m-0">
                    submit
                </button>
              </div>
            </div>
          )}
        {!this.state.addingAccount
          ? (
            <div className="col-12">
              <button
                onClick={() => this.setState({ addingAccount: true })}
                type="button"
                className="btn btn-custom text-capitalize mt-2">
                  add account
              </button>
            </div>
          )
          : (
            <div className="dropdown mt-2">
              <button
                className="btn btn-custom dropdown-toggle d-flex justify-content-between align-items-center text-capitalize mx-auto"
                type="button"
                id="platformsDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                  platforms
              </button>
              <div
                className="dropdown-menu p-0"
                aria-labelledby="platformsDropdown">
                <a
                  onClick={() => this.linkAccount('reddit')}
                  className="dropdown-item border-bottom text-capitalize">
                  <div className="row d-flex align-items-center">
                    <h3 className="mb-0 mr-2">
                      <i className="fab fa-reddit" />
                    </h3>
                      reddit
                  </div>
                </a>
              </div>
            </div>
          )}
        <h2 className="text-primary text-left">Accounts</h2>
        <div className="vh-60 overflow-auto bg-secondary py-4 mt-2">
          {accounts}
          {hasNoAccounts && (
            <div className="col-12">
              <p
                className="bg-primary rounded text-primary text-capitalize py-2">
                no accounts
              </p>
            </div>
          )}
        </div>
        <button
          disabled
          onClick={() => {}}
          type="button"
          className="btn btn-custom text-capitalize mt-3">
          delete art spread account
        </button>
      </div>
    );
  }
}
