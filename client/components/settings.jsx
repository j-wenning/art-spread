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
      username: false,
      password: false,
      account: false
    };
    this.getAccounts = this.getAccounts.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeAccount = this.changeAccount.bind(this);
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

  getAccounts() {
    fetch('/api/accounts')
      .then(res => res.json())
      .then(data => {
        this.setState({ accounts: data });
      });
  }

  changeUsername() {
    this.setState({
      username: !this.state.username
    });
  }

  changePassword() {
    this.setState({
      password: !this.state.password
    });
  }

  changeAccount() {
    this.setState({
      account: !this.state.account
    });
  }

  componentDidMount() {
    this.getAccounts();
  }

  render() {
    const isUsernameButton = this.state.username;
    // const isPasswordButton = this.state.password;
    // const isAccountButton = this.state.account;
    let field;
    if (!isUsernameButton) {
      field = <button className="col btn btn-custom text-custom-primary mb-4">
       Change Username
      </button>;
    } else {
      field = <div className="d-flex"><input className="settings-input mr-2" type="text" />
        <button className="col btn btn-custom text-custom-primary mb-4 ml-2">Submit</button>
      </div>;
    }
    return (
      <div>
        <div className="row d-flex justify-content-center">
          <div className="col-7">
            <div className="pl-0 col col-sm-8 col-md-6 col-lg-5">
              <div className="w-100 d-flex justify-content-center" onClick={this.changeUsername}>
                {field}
              </div>
              <button className="col btn btn-custom text-custom-primary mb-4">
                Change Password
              </button>
              <button className="col btn btn-custom text-custom-primary mb-4">
                Add Account
              </button>
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
