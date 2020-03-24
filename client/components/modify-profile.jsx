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
        <div className="row d-flex justify-content-center">
          <img className="profile-picture mr-2" src={pfp} alt="" />
          <label htmlFor="image-file" className="custom-file-upload btn btn-custom
          text-custom-primary avatar-btn mt-4 ml-2 w-50">
            Upload avatar</label>
          <input onClick={this.handleAvatar}
            id="image-file" type="file" className="imageInput" />
        </div>
      </div>
    );
  }
}

export default ModifyProfile;
