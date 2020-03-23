import React from 'react';

class Login extends React.Component {
  goToDashboard() {
    this.props.setView('dashboard', {});
    fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin'
      })
    }).catch(err => console.error(err));
  }

  render() {
    return (
      <div className="container-fluid flex-column">
        <div className='row justify-content-center align-items-center vh-100'>
          <div className="col-12 flex-column">
            <h1 className="mb-5 brand text-custom-primary text-center">Art Spread</h1>
            <div className="row justify-content-center">
              <button onClick={() => this.goToDashboard()} className='btn btn-custom text-custom-primary w-50 font-weight-bolder rounded-lg'>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
export default Login;
