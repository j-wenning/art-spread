import React from 'react';

class ModifyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {
        picture: null
      },
      image: ''
    };
    this.handleAvatar = this.handleAvatar.bind(this);
  }

  handleAvatar(event) {
    const files = event.target.files;
    this.setState({
      image: files[0]
    });
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
        </form>
      </div>
    );
  }
}

export default ModifyProfile;
