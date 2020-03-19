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
      }
    };
    this.setView = this.setView.bind(this);
  }

  setView(name, params) {
    this.setState({
      view: {
        name: name,
        params
      }
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
            <CreatePost setView={this.setView} />
          </div>
        );
    }
  }
}
