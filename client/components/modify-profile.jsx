import React from 'react';
import AccountItem from './account-item';

class ModifyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: Array(15).fill(0).map((account, i) => ({
        name: 'account name',
        accountId: i
      })),
      profile: {
        picture: null
      },
      image: ''
    };
    this.handleAvatar = this.handleAvatar.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
  }

  handleAvatar(event) {
    const files = event.target.files;
    this.setState({
      image: files[0]
    });
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
    const pfp = this.state.profile.picture || './assets/images/default-profile.svg';
    return (
      <div>
        <form encType="multipart/form-data"
          className="form" id={this.props.profileId}
          onSubmit={this.handleSubmit}>
          <div className="row d-flex justify-content-center">
            <img className="profile-picture mr-2" src={pfp} alt="" />
            <label htmlFor="image-file" className="custom-file-upload btn btn-custom
          text-custom-primary avatar-btn mt-4 ml-2 w-50">
            Upload avatar</label>
            <input onClick={this.handleAvatar}
              id="image-file" type="file" className="imageInput" />
          </div>
          <div className="mt-3 w-100">
            <div className="text-custom-primary ml-1 mb-1 mt-1">
              Vanity handle
            </div>
            <textarea
              className="generalText form-control"
              type="text"
              id="vanityHandle"
              placeholder="vanity handle"
              onChange={this.handleChange}
            />
          </div>
          <div className="w-100">
            <div className="text-custom-primary ml-1 mb-1 mt-1">
              Bio
            </div>
            <textarea
              className="generalText form-control"
              type="text"
              id="bio"
              placeholder="bio"
              onChange={this.handleChange}
            />
          </div>
          <div className="dropdown mt-4">
            <div className="text-custom-primary ml-1 mb-1 mt-1">
              Profile accounts
            </div>
            <button className="w-75 btn btn-custom text-custom-primary d-flex justify-content-around
            dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
              dissociated accounts
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
              <button className="dropdown-item" type="button">account 1</button>
              <button className="dropdown-item" type="button">account 2</button>
              <button className="dropdown-item" type="button">account 3</button>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
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
            <div className="mt-2 d-flex flex-row w-100 justify-content-end mr-4">
              <button className="btn btn-custom text-custom-primary">
               Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default ModifyProfile;
