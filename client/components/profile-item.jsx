import React from 'react';

class ProfileItem extends React.Component {
  render() {
    return (
      // <div  className="mt-2 mb-2 card d-flex align-items-center">
      <div id={this.props.profileId} className="d-flex flex-row card mt-2 mb-2
      pt-2 pb-2 align-items-center justify-content-around">
        <div>{this.props.profilePic}</div>
        <div>{this.props.name}</div>
        <i className="fa fa-trash liked"></i>
      </div>
      // </div>
    );
  }
}

export default ProfileItem;
