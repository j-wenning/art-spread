import React from 'react';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.goToDashboard = this.goToDashboard.bind(this);
  }

  goToDashboard(event) {
    this.props.setView('dashboard', {});
  }

  render() {
    const actionIcon = this.props.title === 'dashboard'
      ? <i className="fas fa-sign-out-alt fa-2x" />
      : <i onClick={this.goToDashboard} className="fas fa-arrow-left fa-2x" />;
    return (
      <div className="header navbar mb-3">
        <h1 className="navbar-brand text-capitalize text-custom-primary">{this.props.title}</h1>
        <button className="btn btn-custom btn-action text-custom-secondary" type="button">
          {actionIcon}
        </button>
      </div>
    );
  }
}
