import React from 'react';
import AccountItem from './account-item';
import ListItem from './list-item';

class ModifyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: Array(10).fill(0).map((account, i) => ({
        type: '',
        name: 'account name',
        accountId: i
      })),
      lists: Array(5).fill(0).map((account, i) => ({
        type: '',
        name: 'account name',
        accountId: i
      })),
      currentPicture: null,
      vanityHandle: '',
      bio: '',
      image: ''
    };
    this.handleAvatar = this.handleAvatar.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goToDashboard = this.goToDashboard.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
  }

  goToDashboard(event) {
    this.props.setView('dashboard', {});
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const newSubmission = {
      vanityHandle: this.state.vanityHandle,
      bio: this.state.bio
    };
    const formData = new FormData();
    formData.append('image', this.state.image);
    fetch(`/api/profiles/${formData}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(res => {
      console.warn(res);
    });
    this.goToDashboard();
    this.props.setProfile(newSubmission);
    this.setState({
      vanityHandle: '',
      bio: ''
    });
    event.currentTarget.reset();
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
        if (data.associated) {
          this.setState({ accounts: data });
        } else if (!data.associated) {
          this.setState({ lists: data });
        }
      });
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

  componentDidMount() {
    this.getAccounts();
  }

  render() {
    const pfp = this.state.currentPicture || './assets/images/default-profile.svg';
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
            <div onChange={this.handleChange} className="text-custom-primary dropdown-menu"
              aria-labelledby="dropdownMenu2">
              {this.state.lists.map(list => {
                return (
                  <ListItem
                    key={list.accountId}
                    name={list.name}
                    id={list.accountId}
                  />);
              })
              }
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
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
            <div className="mt-2 d-flex flex-row w-100 justify-content-end mr-4">
              <button typ="submit" className="btn btn-custom text-custom-primary">
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
