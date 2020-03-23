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
      posts: Array(15).fill(0).map((item, i) => ({
        body: 'test',
        tags: 'tttttttttttttttttttttttttttttttttttttttttttttttagtest',
        poolId: i
      }))
    };
    this.goToCreatePost = this.goToCreatePost.bind(this);
    this.goToSettings = this.goToSettings.bind(this);
    this.goToSwitchProfile = this.goToSwitchProfile.bind(this);
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

  goToCreatePost() {
    this.props.setView('createPost', {});
  }

  goToSettings() {
    this.props.setView('settings', {});
  }

  goToSwitchProfile() {
    this.props.setView('switchProfile', {});
  }

  render() {
    const pfp = this.state.profile.picture || './assets/images/default-profile.svg';
    const pfn = this.state.profile.name || 'profile';
    const posts = this.state.posts.map(post => <PostPreview key={post.poolId} post={post}/>);
    return (
      <div>
        <div className="row">
          <div className="col-7">
            <div className="pl-0 col col-sm-8 col-md-6 col-lg-5">
              <button className="col btn btn-custom text-custom-primary mb-4">Modify Profile</button>
              <button onClick={this.goToSwitchProfile} className="col btn btn-custom text-custom-primary mb-4">Switch Profile</button>
              <button onClick={this.goToCreatePost} className="col btn btn-custom text-custom-primary mb-4">Create Post</button>
            </div>
          </div>
          <div className="col-5">
            <div className="col d-flex justify-content-center">
              <img className="profile-picture" src={pfp} alt="" />
            </div>
            <h2 className="col text-center text-custom-primary">{pfn}</h2>
            <div className="pr-0 ml-0 col row flex-row-reverse">
              <button onClick={this.goToSettings} className="btn btn-custom">
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
