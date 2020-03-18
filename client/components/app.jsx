import React from 'react';
import Login from './login';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // message: null,
      // isLoading: true,
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

  // componentDidMount() {
  //   fetch('/api/health-check')
  //     .then(res => res.json())
  //     .then(data => this.setState({ message: data.message || data.error }))
  //     .catch(err => this.setState({ message: err.message }))
  //     .finally(() => this.setState({ isLoading: false }));
  // }

  render() {
    // return this.state.isLoading
    //   ? <h1>Testing connections...</h1>
    //   : <h1>{ this.state.message.toUpperCase() }</h1>;
    const viewName = this.state.view.name;
    if (viewName === 'login') {
      return (
        <div className='container-fluid background d-flex justify-content-center
        align-items-center w-100 vh-100'>
          <Login />
        </div>
      );
    }
  }
}
