import React from 'react';

class ProfileItem extends React.Component {
  render() {
    return (
      <div id={this.props.profileId} className="d-flex flex-row  mt-2 mb-2
      pt-2 pb-2 align-items-center justify-content-around">
        <div>{this.props.profilePic}</div>
        <div onClick={this.props.getProfiles} className="text-center text-custom-primary card p-2 profile-name w-50">
          {this.props.name}</div>
        <i onClick={this.props.deleteProfile} className="fa fa-trash-alt liked card p-2 trash"></i>
      </div>
    );
  }
}

export default ProfileItem;
