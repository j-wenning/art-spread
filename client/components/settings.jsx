import React from 'react';
import AccountItem from './account-item';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: Array(15).fill(0).map((account, i) => ({
        name: 'account name',
        accountId: i
      }))
    };
    this.getAccounts = this.getAccounts.bind(this);
  }

  getAccounts() {
    fetch('/api/accounts')
      .then(res => res.json())
      .then(data => {
        this.setState({ accounts: data });
      });
  }

  componentDidMount() {
    this.getAccounts();
  }

  render() {
    return (
      <div>
        <div className="row d-flex justify-content-center">
          <div className="col-7">
            <div className="pl-0 col col-sm-8 col-md-6 col-lg-5">
              <button className="col btn btn-custom text-custom-primary mb-4">
                Change Username
              </button>
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
              {this.state.accounts.map(account => {
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
