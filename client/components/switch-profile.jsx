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
    fetch('/api/profiles')
      .then(res => res.json())
      .then(data => {
        this.setState({ profiles: data });
      });
  }

  deleteProfile() {
    const eventTarget = event.target.id;
    fetch(`/api/profiles/${eventTarget}`, {
      method: 'DELETE'
    })
      .then(() => {
        function test(profile) {
          return profile.id !== Number(eventTarget);
        }
        const newArr = this.state.profiles.filter(test);
        this.setState({
          profiles: newArr
        });
      });
  }

  createProfile() {
    fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId: 'admin',
        name: 'admin',
        imagePath: 'admin',
        userId: 'admin'
      })
    }).then(response => response.json())
      .then(data => {
        this.setState({
          profiles: this.state.profiles.concat(data)
        });
      });
  }

  goToModifyProfile(event) {
    this.props.setView('modifyProfile', {});
  }

  componentDidMount() {
    this.getProfiles();
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col">
            <div className="prof-list overflow-auto">
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
            <button onClick={this.goToModifyProfile} className="btn btn-custom text-custom-primary">
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }
}
