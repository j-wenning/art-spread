import React from 'react';
import PostPreview from './post-preview';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {
        picture: null,
        name: null
      },
      posts: []
    };
  }

  getProfile() {
    fetch('/api/profiles')
      .then(res => res.json())
      .then(data => {
        this.setState({ profile: data });
      });
  }

  getPosts() {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        this.setState({ posts: data });
      });
  }

  componentDidMount() {
    this.getProfile();
  }

  render() {
    const pfp = this.state.profile.picture || './assets/images/default-profile.svg';
    const pfn = this.state.profile.name || 'profile';
    const posts = this.state.posts.map((post, index) => <PostPreview key={index}/>);
    return (
      <div>
        <div className="row">
          <div className="col-6">
            <button className="btn col-12 col-sm-6 col-md-4 col-lg-3 col btn-custom text-custom-primary mb-4">Modify Profile</button>
            <button className="btn col-12 col-sm-6 col-md-4 col-lg-3 col btn-custom text-custom-primary mb-4">Switch Profile</button>
            <button className="btn col-12 col-sm-6 col-md-4 col-lg-3 col btn-custom text-custom-primary mb-4">Create Post</button>
          </div>
          <div className="col-6">
            <div className="col-12 d-flex justify-content-center">
              <img className="profile" src={pfp} alt="avatar" />
            </div>
            <h2 className="col-12 text-center text-custom-primary">{pfn}</h2>
            <div className="col-12 row flex-row-reverse">
              <button className="btn btn-custom">
                <i className="fas fa-cog fa-2x text-custom-secondary" />
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h2 className="text-custom-primary">Posts</h2>
            <div className="list overflow-auto">
              {posts}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
