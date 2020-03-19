import React from 'react';
import Dashboard from './dashboard';
import Header from './header';
import Login from './login';
import CreatePost from './create-post';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: {
        name: 'login',
        params: {}
      },
      comments: []
    };
    this.setView = this.setView.bind(this);
    this.makePost = this.makePost.bind(this);
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
          name: 'viewPost',
          comments: this.state.comments.concat(data)
        });
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
    }
  }
}
