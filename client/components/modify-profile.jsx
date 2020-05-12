import React from 'react';

export default class ModifyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      name: '',
      bio: '',
      avatarError: false,
      rawAvatar: null,
      accounts: []
    };
  }

  toggleLinked(index) {
    if (this.state.accounts[index].isLinked) this.props.deleteLink(index);
    else this.props.createLink(index);
    this.setState(state => {
      const account = state.accounts[index];
      account.isLinked = !account.isLinked;
      return state;
    });
  }

  stateUpdate(e) {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    if (id === 'avatar') {
      const file = e.currentTarget.files[0];
      if (file.size < 10000) {
        const fr = new FileReader();
        fr.onload = () => this.setState({
          avatar: file,
          avatarError: false,
          rawAvatar: fr.result
        });
        fr.onerror = () => console.error(fr.error);
        fr.readAsDataURL(file);
      } else this.setState({ avatar: '', rawAvatar: '', avatarError: true });
    } else this.setState({ [id]: value.trim() });
  }

  componentDidMount() {
    this.props.fetchAccounts()
      .then(data => this.setState({ accounts: data }))
      .catch(err => console.error(err));
  }

  render() {
    let hasNoLinks = true;
    const defaultPfp = '/assets/images/default-profile.svg';
    const linkedAccounts = this.state.accounts.map((item, index) => {
      if (item.isLinked) {
        hasNoLinks = false;
        return (
          <div key={index} className="account col-12">
            <div className="row p-2">
              <div
                className="btn-custom-menu d-flex justify-content-center align-items-center border-0">
                <h2 className="m-0 text-primary">
                  <i className={`fab fa-${item.type}`}/>
                </h2>
              </div>
              <div className="col">
                <p
                  className="col-12 rounded-15 bg-primary text-center text-truncate text-primary p-3">
                  {item.name}
                </p>
              </div>
              <button
                onClick={() => this.toggleLinked(index)}
                type="button"
                className="btn btn-custom-menu border-0">
                <i className="fas fa-unlink text-danger"/>
              </button>
            </div>
          </div>
        );
      }
    });
    const unlinkedAccounts = this.state.accounts.map((item, index) => {
      if (!item.isLinked) {
        return (
          <button
            onClick={() => this.toggleLinked(index)}
            key={index}
            type="button"
            className="dropdown-item border-bottom">
            <div
              className="row d-flex text-secondary align-items-center">
              <h3 className="mb-0 mr-2">
                <i className={`fab fa-${item.type}`}/>
              </h3>
              {item.name}
            </div>
          </button>
        );
      }
    });
    return (
      <div className="modify-profile container">
        <div className="row">
          <div className="col-6">
            <img
              src={this.state.rawAvatar || (this.props.profile ? this.props.profile.imgPath || defaultPfp : defaultPfp)}
              alt=""
              className="img-window border rounded-circle border-secondary bg-primary"/>
          </div>
          <div className="col-6 d-flex justify-content-center align-items-center">
            <div>
              <label
                htmlFor="avatar"
                className="btn btn-custom d-flex justify-content-center align-items-center text-capitalize mt-2">
                upload avatar
              </label>
              <input
                onChange={e => this.stateUpdate(e)}
                type="file"
                id="avatar"
                accept=".jpg, .jpeg, .png, .svg"
                className="d-none"/>
              {this.state.avatar && (
                <button
                  onClick={() => { this.setState({ avatar: '', rawAvatar: null }); }}
                  type="button"
                  className="btn btn-custom text-capitalize">
                    cancel
                </button>
              )}
            </div>
          </div>
        </div>
        {this.state.avatarError && (
          <div className="alert alert-danger mt-1" role="alert">
            <p>Image exceeds maximum filesize (10KB)!</p>
            <p className="mb-0">
                Since this is a simple proof of concept, space must be conserved.
            </p>
          </div>
        )}
        <h3 className="text-primary text-capitalize mt-3">vanity handle</h3>
        <input
          onChange={e => this.stateUpdate(e)}
          id="name"
          type="text"
          placeholder="enter vanity handle here..."
          defaultValue={this.props.profile ? this.props.profile.name : ''}
          className="col-12 border-secondary rounded bg-primary p-3"/>
        <h3 className="text-primary text-capitalize mt-3">bio</h3>
        <textarea
          onChange={e => this.stateUpdate(e)}
          id="bio"
          type="text"
          placeholder="enter bio here..."
          defaultValue={this.props.profile ? this.props.profile.bio : ''}
          className="col-12 border-secondary rounded bg-primary p-3"/>
        <h3 className="text-primary text-capitalize mt-3">profile accounts</h3>
        <div className="dropdown">
          <button
            type="button"
            id="unlinkedAccountsDropdown"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            className="btn btn-custom dropdown-toggle d-flex justify-content-between align-items-center text-capitalize mx-auto">
            unlinked accounts
          </button>
          <div
            aria-labelledby="loginDropdown"
            className="dropdown-menu p-0">
            {unlinkedAccounts}
          </div>
        </div>
        <div className="vh-60 overflow-auto bg-secondary py-4 mt-2">
          {linkedAccounts}
          {hasNoLinks && (
            <div className="col-12">
              <p
                className="bg-primary rounded text-primary text-center text-capitalize py-2">
                no linked accounts
              </p>
            </div>
          )}
        </div>
        <div className="text-center">
          <button
            onClick={() => this.props.modifyProfile({
              avatar: this.state.avatar,
              name: this.state.name,
              bio: this.state.bio
            })}
            type="button"
            className="btn btn-custom text-capitalize mt-4">
            save
          </button>
        </div>
      </div>
    );
  }
}
