import React from 'react';

export default class SwitchProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { profiles: [] };
  }

  deleteProfile(index) {
    this.props.deleteProfile(index);
    this.setState(state => {
      state.profiles.splice(index, 1);
      return state;
    });
  }

  componentDidMount() {
    this.props.fetchProfiles()
      .then(data => this.setState({ profiles: data }))
      .catch(err => console.error(err));
  }

  render() {
    const profiles = this.state.profiles.map((item, index) => (
      <div key={index} className="profile col-12">
        <div className="row p-2">
          <button
            onClick={() => this.props.setCurrentProfile(index)}
            type="button"
            className="col btn btn-custom text-primary border-0 mr-2">
            {item.name}
          </button>
          <button
            onClick={() => this.deleteProfile(index)}
            type="button"
            className="btn btn-custom-menu border-0">
            <i className="fas fa-trash text-danger" />
          </button>
        </div>
      </div>
    ));
    const hasNoProfiles = !this.state.profiles.length;
    return (
      <div className="switch-profile container text-center">
        <button
          onClick={() => {
            this.props.createProfile();
            this.props.viewModifyProfile();
          }}
          type="button"
          className="btn btn-custom text-capitalize">
          create profile
        </button>
        <div className="vh-60 overflow-auto bg-secondary py-4 mt-2">
          {profiles}
          {hasNoProfiles && (
            <div className="col-12">
              <p
                className="bg-primary rounded text-primary text-capitalize py-2">
                no profiles
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
