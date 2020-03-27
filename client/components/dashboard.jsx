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
      switch: true,
      publishedPosts: [],
      unpublishedPosts: []
    };
    this.goToCreatePost = this.goToCreatePost.bind(this);
    this.goToSettings = this.goToSettings.bind(this);
    this.goToSwitchProfile = this.goToSwitchProfile.bind(this);
    this.pendingPost = this.pendingPost.bind(this);
    this.alreadyPosted = this.alreadyPosted.bind(this);
    this.goToViewPost = this.goToViewPost.bind(this);
    this.goToModifyProfile = this.goToModifyProfile.bind(this);
  }

  getProfile() {
    fetch('/api/profiles')
      .then(res => res.json())
      .then(data => {
        this.setState({ profile: data });
      });
  }

  getPosts() {
    fetch('/api/posts?postId=1&postCount=10')
      .then(res => res.json())
      .then(data => this.setState({
        publishedPosts: data.filter(item => item.published),
        unpublishedPosts: data.filter(item => !item.published)
      }));
  }

  componentDidMount() {
    this.getProfile();
    this.getPosts();
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

  goToViewPost() {
    this.props.setView('viewPost', {});
  }

  goToModifyProfile() {
    this.props.setView('modifyProfile', {});
  }

  pendingPost() {
    this.setState({
      switch: false
    });
  }

  alreadyPosted() {
    this.setState({
      switch: true
    });
  }

  render() {
    const pfp = this.state.profile.picture || './assets/images/default-profile.svg';
    const pfn = this.state.profile.name || 'profile';
    const posts = this.state.publishedPosts.map(post => <PostPreview key={post.postId} post={post} pending={false}/>);
    const pendingPosts = this.state.unpublishedPosts.map(post => <PostPreview key={post.postId} post={post} pending={true}/>);

    if (this.state.switch) {
      return (
        <div>
          <div className="row">
            <div className="col-7">
              <div className="pl-0 col col-sm-8 col-md-6 col-lg-5">
                <button onClick={this.goToModifyProfile} className="col btn btn-custom text-custom-primary mb-4">Modify Profile</button>
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
            <ul className="ml-3 nav nav-pills">
              <li className="nav-item">
                <a className="nav-link selected" onClick={this.alreadyPosted}>Posts</a>
              </li>
              <li className="nav-item text-custom-primary">
                <a className="nav-link" onClick={this.pendingPost}>Pending Posts</a>
              </li>
            </ul>
          </div>
          <div onClick={this.goToViewPost} className="list overflow-auto">
            {posts}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="row">
            <div className="col-7">
              <div className="pl-0 col col-sm-8 col-md-6 col-lg-5">
                <button onClick={this.goToModifyProfile} className="col btn btn-custom text-custom-primary mb-4">
                  Modify Profile
                </button>
                <button className="col btn btn-custom text-custom-primary mb-4">
                  Switch Profile
                </button>
                <button
                  onClick={this.goToCreatePost}
                  className="col btn btn-custom text-custom-primary mb-4"
                >
                  Create Post
                </button>
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
            <ul className="ml-3 nav nav-pills">
              <li className="nav-item text-custom-primary">
                <a className="nav-link" onClick={this.alreadyPosted}>Posts</a>
              </li>
              <li className="nav-item">
                <a className="nav-link selected" onClick={this.pendingPost}>Pending Posts</a>
              </li>
            </ul>
          </div>
          <div className="list overflow-auto">{pendingPosts}</div>
        </div>
      );
    }
  }
}
