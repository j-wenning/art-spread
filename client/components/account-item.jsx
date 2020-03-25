import React from 'react';

class AccountItem extends React.Component {
  render() {
    return (
      <div id={this.props.accountId} className="mt-1 mb-1  d-flex">
        <div className="w-100 d-flex flex-row pt-2 pb-2 align-items-center justify-content-around">
          <i className="fab fa-reddit fa-2x"></i>
          <div className="text-center text-custom-primary card p-2 profile-name w-50">{this.props.name}</div>
          <i onClick={this.props.deleteAccount} className="fa fa-trash-alt liked card p-2 trash"></i>
        </div>
      </div>
    );
  }
}

export default AccountItem;
