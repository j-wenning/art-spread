import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.goToDashboard = this.goToDashboard.bind(this);
  }

  goToDashboard(event) {
    this.props.setView('dashboard', {});
  }

  render() {
    return (
      <div className='d-flex justify-content-center flex-column align-items-center
      text-center'>
        <h1 className='mb-5 generalText loginHeader'>Art Spread</h1>
        <button onClick={this.goToDashboard} className='mb-5 generalText w-50
        font-weight-bolder rounded-lg loginButton'>
          Sign In
        </button>
      </div>
    );
  }
}
export default Login;
