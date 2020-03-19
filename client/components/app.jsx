import React from 'react';
import Login from './login';
import CreatePost from './create-post';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: {
        name: 'createPost',
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
    const setView = this.setView;
    const viewName = this.state.view.name;
    switch (viewName) {
      case 'login':
        return (
          <div className='container-fluid background d-flex justify-content-center
        align-items-center w-100 vh-100'>
            <Login setView={setView} />
          </div>
        );
      case 'createPost':
        return (
          <div className='container-fluid justify-content-center background d-flex w-100 vh-100'>
            <CreatePost setView={setView} />
          </div>
        );
    }
  }
}
