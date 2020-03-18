import React from 'react';
import Login from './login';

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
    const setView = this.setView;
    const viewName = this.state.view.name;
    if (viewName === 'login') {
      return (
        <div className='container-fluid background d-flex justify-content-center
        align-items-center w-100 vh-100'>
          <Login setView={setView} />
        </div>
      );
    }
  }
}
