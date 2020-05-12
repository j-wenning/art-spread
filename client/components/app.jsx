import React from 'react';
import Header from './header';
import Login from './login';
import Dashboard from './dashboard';
import ModifyProfile from './modify-profile';
import SwitchProfile from './switch-profile';
import CreatePost from './create-post';
import Settings from './settings';
import ViewPost from './view-post';
import ViewComment from './view-comment';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewStack: [{
        name: 'login',
        params: {}
      }],
      profile: null,
      posts: [],
      error: null
    };
    this.abortCon = new AbortController();
  }

  login(user, pass) {
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, pass }),
      signal: this.abortCon.signal
    }).then(res => res.json())
      .then(data => {
        this.pushView('dashboard');
        this.setState({ profile: data.profile });
      }).catch(err => console.error(err));
  }

  logout() {
    fetch('/api/logout', { signal: this.abortCon.signal })
      .then(() => {
        this.setState({
          viewStack: [{
            name: 'login',
            params: {}
          }],
          profile: null,
          posts: []
        });
      }).catch(err => console.error(err));
  }

  fetchProfiles() {
    return fetch('/api/profiles', { signal: this.abortCon.signal })
      .then(res => res.json())
      .catch(err => console.error(err));
  }

  modifyProfile(data) {
    const formData = new FormData();
    for (const key in data) formData.append(key, data[key]);
    fetch('/api/profile/modify', {
      method: 'PATCH',
      body: formData,
      signal: this.abortCon.signal
    }).then(res => res.json())
      .then(data => {
        this.setState({ profile: data });
        this.resetToDashboard();
      }).catch(err => console.error(err));
  }

  createProfile() {
    fetch('/api/profile/create', {
      method: 'POST',
      signal: this.abortCon.signal
    }).then(res => res.json())
      .then(data => this.setState({ profile: data }))
      .catch(err => console.error(err));
  }

  setCurrentProfile(index) {
    fetch(`/api/profile/${index}`, { signal: this.abortCon.signal })
      .then(res => res.json())
      .then(data => {
        this.setState({ profile: data });
        this.resetToDashboard();
      }).catch(err => console.error(err));
  }

  deleteProfile(index) {
    fetch(`/api/profile/${index}`, {
      method: 'DELETE',
      signal: this.abortCon.signal
    }).then(() => this.setCurrentProfile(0))
      .catch(err => console.error(err));
  }

  fetchAccounts() {
    return fetch('/api/accounts', { signal: this.abortCon.signal })
      .then(res => res.json())
      .catch(err => console.error(err));
  }

  linkAccount(platform) {
    fetch(`/api/account/link/${platform}`, { signal: this.abortCon.signal })
      .then(res => res.json())
      .then(data => window.open(data.url, '_blank'))
      .catch(err => console.error(err));
  }

  removeAccount(index) {
    fetch(`/api/account/${index}`, {
      method: 'DELETE',
      signal: this.abortCon.signal
    }).catch(err => console.error(err));
  }

  createLink(index) {
    fetch(`/api/link/${index}`, {
      method: 'POST',
      signal: this.abortCon.signal
    }).catch(err => console.error(err));
  }

  deleteLink(index) {
    fetch(`/api/link/${index}`, {
      method: 'DELETE',
      signal: this.abortCon.signal
    }).catch(err => console.error(err));
  }

  fetchPosts() {
    fetch('/api/posts', { signal: this.abortCon.signal })
      .then(res => res.json())
      .then(data => this.setState({ posts: data }))
      .catch(err => console.error(err));
  }

  createPost(data) {
    const formData = new FormData();
    for (const key in data) formData.append(key, data[key]);
    fetch('/api/post', {
      method: 'POST',
      body: formData,
      signal: this.abortCon.signal
    }).then(res => res.json())
      .then(data => {
        this.setState({ posts: [...this.state.posts, data] });
        this.resetToDashboard();
        this.pushView('post', {
          post: data,
          index: this.state.posts.length - 1,
          canPublish: true
        });
      }).catch(err => console.error(err));
  }

  deletePost(index) {
    fetch(`/api/post/${index}`, {
      method: 'DELETE',
      signal: this.abortCon.signal
    }).then(() => {
      this.setState(state => {
        state.posts.splice(index, 1);
        return state;
      });
      this.resetToDashboard();
    }).catch(err => console.error(err));
  }

  fetchPublications(index) {
    return fetch(`/api/post/${index}/publications`, { signal: this.abortCon.signal })
      .then(res => res.json())
      .catch(err => console.error(err));
  }

  publishPost(index) {
    return fetch(`/api/post/publish/${index}`, {
      method: 'POST',
      signal: this.abortCon.signal
    })
      .then(() => this.setState(state => {
        state.posts[index].isPublished = true;
        return state;
      })).catch(err => console.error(err));
  }

  toggleLike(accountIndex, id, value) {
    return fetch('/api/comment/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountIndex, id, value }),
      signal: this.abortCon.signal
    }).catch(err => console.error(err));
  }

  publishReply(accountIndex, id, value) {
    return fetch('/api/comment/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountIndex, id, value }),
      signal: this.abortCon.signal
    }).then(res => res.json())
      .catch(err => console.error(err));
  }

  healthCheck() {
    fetch('/api/health-check', { signal: this.abortCon.signal })
      .then(() => this.setState({ error: false }))
      .catch(err => this.setState({ error: err }));
  }

  pushView(name, params = {}) {
    this.setState(state => {
      state.viewStack.push({ name, params });
      return state;
    });
  }

  popView() {
    this.abortCon.abort();
    this.abortCon = new AbortController();
    if (this.peekView().name === 'dashboard') return this.logout();
    this.setState(state => {
      state.viewStack.pop();
      return state;
    });
  }

  peekView() {
    return this.state.viewStack.length ? this.state.viewStack.slice(-1)[0] : {};
  }

  resetToDashboard() {
    this.setState({
      viewStack: [
        { name: 'login', params: {} },
        { name: 'dashboard', params: {} }
      ]
    });
  }

  componentDidMount() {
    this.healthCheck();
  }

  render() {
    let page = null;
    switch (this.peekView().name) {
      case 'login':
        page = (
          <Login
            login={(user, pass) => this.login(user, pass)}/>
        );
        break;
      case 'dashboard':
        page = (
          <Dashboard
            profile={this.state.profile}
            posts={this.state.posts}
            viewModifyProfile={() => this.pushView('profile')}
            viewSwitchProfile={() => this.pushView('profiles')}
            viewCreatePost={() => this.pushView('create post')}
            viewSettings={() => this.pushView('settings')}
            viewViewPost={params => this.pushView('post', params)}
            fetchPosts={() => this.fetchPosts()}
            fetchAccounts={() => this.fetchAccounts()}/>
        );
        break;
      case 'profile':
        page = (
          <ModifyProfile
            profile={this.state.profile}
            resetToDashboard={() => this.resetToDashboard()}
            fetchAccounts={() => this.fetchAccounts()}
            modifyProfile={data => this.modifyProfile(data)}
            createLink={index => this.createLink(index)}
            deleteLink={index => this.deleteLink(index)}/>
        );
        break;
      case 'profiles':
        page = (
          <SwitchProfile
            viewModifyProfile={() => this.pushView('profile')}
            resetToDashboard={() => this.resetToDashboard()}
            fetchProfiles={() => this.fetchProfiles()}
            createProfile={() => this.createProfile()}
            setCurrentProfile={index => this.setCurrentProfile(index)}
            deleteProfile={index => this.deleteProfile(index)}/>
        );
        break;
      case 'create post':
        page = (
          <CreatePost
            createPost={data => this.createPost(data)}/>
        );
        break;
      case 'settings':
        page = (
          <Settings
            fetchAccounts={() => this.fetchAccounts()}
            linkAccount={platform => this.linkAccount(platform)}
            removeAccount={index => this.removeAccount(index)}/>
        );
        break;
      case 'post':
        // eslint-disable-next-line no-case-declarations
        const { post, index, canPublish } = this.peekView().params;
        page = (
          <ViewPost
            post={post}
            canPublish={canPublish}
            viewViewComment={params => this.pushView('comment', params)}
            deletePost={() => this.deletePost(index)}
            publishPost={() => this.publishPost(index)}
            fetchPublications={() => this.fetchPublications(index)}
            toggleLike={(accountIndex, id, value) =>
              this.toggleLike(accountIndex, id, value)}/>
        );
        break;
      case 'comment':
        // eslint-disable-next-line no-case-declarations
        const { comment, replies } = this.peekView().params;
        page = (
          <ViewComment
            comment={comment}
            replies={replies}
            viewViewComment={params => this.pushView('comment', params)}
            toggleLike={(accountIndex, id, value) =>
              this.toggleLike(accountIndex, id, value)}
            publishReply={(accountIndex, id, value) =>
              this.publishReply(accountIndex, id, value)}/>
        );
        break;
      default:
        break;
    }
    if (this.state.error === null) {
      return (
        <h2>Loading...</h2>
      );
    } else if (this.state.error) {
      return (
        <h2>An error has occured.</h2>
      );
    }
    return (
      <div className="app container bg-transparent mx-auto mb-5 pb-5">
        {this.peekView().name !== 'login' && (
          <Header
            name={this.peekView().name}
            popView={() => this.popView()} />
        )}
        {page}
      </div>
    );
  }
}
