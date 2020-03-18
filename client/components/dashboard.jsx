import React from 'react';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {
        picture: null,
        name: null
      }
    };
  }

  getPicture() {
    fetch('/api/profiles')
      .then(res => res.json())
      .then(data => {
        this.setState({ picture: data });
      });

  }

  render() {
    const pfp = 1;
    return (
      <div>
        <div className="row">
          <div className="col-6">
            <button className="btn col-12 col-sm-6 col-md-4 col-lg-3 btn-custom text-custom-primary mb-3">Modify Profile</button>
            <button className="btn col-12 col-sm-6 col-md-4 col-lg-3 col btn-custom text-custom-primary mb-3">Switch Profile</button>
            <button className="btn col-12 col-sm-6 col-md-4 col-lg-3 col btn-custom text-custom-primary mb-3">Create Post</button>
          </div>
          <div className="col-6">
            <img className="profile" src={pfp} alt="avatar"/>
          </div>
        </div>

      </div>
    );
  }
}
