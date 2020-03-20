import React from 'react';
// import PostPreview from './post-preview';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: {
        name: null
      }
    };
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
        <div className="row">
          <div className="col-7">
            <div className="pl-0 col col-sm-8 col-md-6 col-lg-5">
              <button className="col btn btn-custom text-custom-primary mb-4">
                Change Username
              </button>
              <button className="col btn btn-custom text-custom-primary mb-4">
                Change Password
              </button>
              <button className="col btn btn-custom text-custom-primary mb-4">
                Change Password
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h2 className="text-custom-primary">Accounts</h2>
              <div className="list overflow-auto">
              account name
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
      </div>
    );
  }
}
