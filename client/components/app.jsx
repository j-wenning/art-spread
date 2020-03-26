import React from 'react';
import Dashboard from './dashboard';
import Header from './header';
import Login from './login';
import CreatePost from './create-post';
import Settings from './settings';
import ViewPost from './view-post';
import SwitchProfile from './switch-profile';
import ModifyProfile from './modify-profile';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: {
        name: 'login',
        params: {}
      },
      username: null,
      password: null,
      account: null
    };
    this.setView = this.setView.bind(this);
    this.makePost = this.makePost.bind(this);
    this.addUsername = this.addUsername.bind(this);
    this.addPassword = this.addPassword.bind(this);
    this.addAccount = this.addAccount.bind(this);
  }

  setView(name, params) {
    this.setState({
      view: {
        name: name,
        params
      }
    });
  }

  makePost(post) {
    fetch('/api/r/art', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          name: 'viewPost'
        });
      });
  }

  addUsername(newUsername) {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUsername)
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          username: data
        });
      });
  }

  addPassword(newPassword) {
    fetch('/api/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPassword)
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          password: data
        });
      });
  }

  addAccount(newAccount) {
    fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAccount)
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          account: data
        });
      });
  }

  componentDidMount() {
    fetch('/api/username')
      .then(response => response.json())
      .then(data => {
        this.setState({ username: data });
      });
    fetch('/api/password')
      .then(response => response.json())
      .then(data => {
        this.setState({ password: data });
      });
    fetch('/api/accounts')
      .then(response => response.json())
      .then(data => {
        this.setState({ account: data });
      });
  }

  render() {
    switch (this.state.view.name) {
      case 'login':
        return (
          <Login setView={(name, params) => this.setView(name, params)} />
        );
      case 'dashboard':
        return (
          <div className="app">
            <Header setView={this.setView} title={this.state.view.name} />
            <Dashboard setView={this.setView}/>
          </div>
        );
      case 'createPost':
        return (
          <div className="app">
            <Header setView={this.setView} title={this.state.view.name} />
            <CreatePost makePost={this.makePost} setView={this.setView}
              viewParams={this.state.view.params} />
          </div>
        );
      case 'settings':
        return (
          <div className="app">
            <Header setView={this.setView} title={this.state.view.name} />
            <Settings addUsername={this.addUsername} addPassword={this.addPassword}
              addAccount={this.addAccount} setView={this.setView} />
          </div>
        );
      case 'viewPost':
        return (
          <div className="app">
            <Header setView={this.setView} title={this.state.view.name} />
            <ViewPost setView={this.setView} />
          </div>
        );
      case 'switchProfile':
        return (
          <div className="app">
            <Header setView={this.setView} title={this.state.view.name} />
            <SwitchProfile setView={this.setView} />
          </div>
        );
      case 'modifyProfile':
        return (
          <div className="app">
            <Header setView={this.setView} title={this.state.view.name} />
            <ModifyProfile setView={this.setView} />
          </div>
        );
    }
  }
}
