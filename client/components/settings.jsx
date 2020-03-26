import React from 'react';
import AccountItem from './account-item';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: Array(15).fill(0).map((account, i) => ({
        name: 'account name',
        accountId: i
      })),
      username: '',
      password: '',
      account: null,
      toggleUsername: false,
      togglePassword: false,
      toggleAccount: false,
      isSubmitted: false
    };
    this.getAccounts = this.getAccounts.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeAccount = this.changeAccount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitUsername = this.handleSubmitUsername.bind(this);
    this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
    this.handleSubmitAccount = this.handleSubmitAccount.bind(this);
  }

  deleteAccount() {
    const eventTarget = event.target.id;
    fetch(`/api/profiles/${eventTarget}`, {
      method: 'DELETE'
    })
      .then(() => {
        function test(account) {
          return account.accountId !== Number(eventTarget);
        }
        const newArr = this.state.accounts.filter(test);
        this.setState({
          accounts: newArr
        });
      });
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmitUsername(event) {
    event.preventDefault();
    const newSubmission = {
      username: this.state.username
    };
    if (event.target.value.length > 0) {
      this.props.addUsername(newSubmission);
      event.currentTarget.reset();
      this.setState({
        username: '',
        isSubmitted: true
      });
    }
  }

  handleSubmitPassword(event) {
    event.preventDefault();
    const newSubmission = {
      password: this.state.password
    };
    this.props.addPassword(newSubmission);
    event.currentTarget.reset();
    this.setState({
      password: ''
    });
  }

  handleSubmitAccount(event) {
    event.preventDefault();
    const newSubmission = {
      account: this.state.account
    };
    this.props.addAccount(newSubmission);
    event.currentTarget.reset();
    this.setState({
      account: null
    });
  }

  getAccounts() {
    fetch('/api/accounts')
      .then(res => res.json())
      .then(data => {
        this.setState({ accounts: data });
      });
  }

  changeUsername() {
    this.setState({
      toggleUsername: !this.state.toggleUsername
    });
  }

  changePassword() {
    this.setState({
      togglePassword: !this.state.togglePassword
    });
  }

  changeAccount() {
    this.setState({
      toggleAccount: !this.state.toggleAccount
    });
  }

  componentDidMount() {
    this.getAccounts();
  }

  render() {
    const isUsernameButton = this.state.toggleUsername;
    const isPasswordButton = this.state.togglePassword;
    const isAccountButton = this.state.toggleAccount;
    let field;
    let field2;
    let field3;
    if (!isUsernameButton) {
      field = <div> <button onClick={this.changeUsername} className="col btn btn-custom text-custom-primary mb-4">
       Change Username
      </button>
      {this.state.isSubmitted ? <i className="fas fa-check"></i> : ''}
      </div>;
    } else if (isUsernameButton) {
      field = <form onSubmit={this.handleSubmitUsername} className="d-flex"><input onChange={this.handleChange}
        className="settings-input mr-2" type="text" />
      <button onClick={this.changeUsername} className="col btn btn-custom text-custom-primary mb-4 ml-2">Submit</button>
      </form>;
    }
    if (!isPasswordButton) {
      field2 = <button onClick={this.changePassword}
        className="col btn btn-custom text-custom-primary mb-4">
        Change Password
      </button>;
    } else if (isPasswordButton) {
      field2 = <form onSubmit={this.handleSubmitPassword} className="d-flex"><input onChange={this.handleChange}
        className="settings-input mr-2" type="password" />
      <button onClick={this.changePassword} className="col btn btn-custom text-custom-primary mb-4 ml-2">Submit</button>
      </form>;
    }
    if (!isAccountButton) {
      field3 = <button onClick={this.changeAccount} className="col btn btn-custom text-custom-primary mb-4">
        Add Account
      </button>;
    } else if (isAccountButton) {
      field3 = <form onSubmit={this.handleSubmitAccount} className="d-flex"><button className="settings-dropdown btn btn-custom text-custom-primary d-flex justify-content-around
            dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown"
      aria-haspopup="true" aria-expanded="false">
        social media
      </button>
      <div onChange={this.handleChange} className="selected w-100 text-custom-primary dropdown-menu p-0"
        aria-labelledby="dropdownMenu2">
        <div className="w-100 d-flex flex-row justify-content-around">
          <i className="fab fa-reddit fa-2x icon-color mt-1"></i>
          <a className="text-custom-primary mt-2 mb-2 mr-2">Reddit</a>
        </div>
      </div>
      <button onClick={this.changeAccount} className="col btn btn-custom text-custom-primary mb-4 ml-2">Submit</button>
      </form>;
    }
    return (
      <div>
        <div className="row d-flex justify-content-center">
          <div className="col-7">
            <div className="pl-0 col col-sm-8 col-md-6 col-lg-5">
              <div className="w-100 d-flex justify-content-center">
                {field}
              </div>
              <div className="w-100 d-flex justify-content-center">
                {field2}
              </div>
              <div className="w-100 d-flex justify-content-center">
                {field3}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h2 className="text-custom-primary">Accounts</h2>
            <div className="list overflow-auto">
              {this.deleteAccount && this.state.accounts.map(account => {
                return (
                  <AccountItem
                    key={account.accountId}
                    name={account.name}
                    id={account.accountId}
                  />);
              })
              }
            </div>
          </div>
        </div>
        <div className="row">
          <div className="mt-2 d-flex flex-row w-100 justify-content-center">
            <button className="btn btn-custom text-custom-primary">
              Delete Art Spread account
            </button>
          </div>
        </div>
      </div>
    );
  }
}
