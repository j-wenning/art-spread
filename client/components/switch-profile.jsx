import React from 'react';
import ProfileItem from './profile-item';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: Array(15).fill(0).map((account, i) => ({
        profilePic: 'img',
        name: 'profile name',
        profileId: i
      }))
    };
  }

  getProfiles() {
    fetch('/api/accounts')
      .then(res => res.json())
      .then(data => {
        this.setState({ profiles: data });
      });
  }

  componentDidMount() {
    this.getProfiles();
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col">
            <div className="list overflow-auto">
              {this.state.profiles.map(profile => {
                return (
                  <ProfileItem
                    key={profile.profileId}
                    profilePic={profile.profilePic}
                    name={profile.name}
                    id={profile.profileId}
                  />);
              })
              }
            </div>
          </div>
        </div>
        <div className="row">
          <div className="mt-2 d-flex flex-row w-100 justify-content-center">
            <button className="btn btn-custom text-custom-primary">
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }
}
