import React from 'react';

export default class Header extends React.Component {
  render() {
    const icon = this.props.name === 'dashboard'
      ? <i className="fas fa-sign-out-alt"/>
      : <i className="fas fa-arrow-left"/>;
    return (
      <div className="header navbar text-capitalize border-bottom border-primary mb-4">
        <h1 className="mb-0 mt-3">
          {this.props.name}
        </h1>
        <a
          onClick={this.props.popView}
          className="btn btn-custom-menu d-flex justify-content-center align-items-center">
          {icon}
        </a>
      </div>
    );
  }
}
