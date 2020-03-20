import React from 'react';

class AccountItem extends React.Component {
  render() {
    return (
      <div id={this.props.accountId} className="card d-flex align-items-center">
        <div className=" d-flex flex-row">
          <p className="card-title">{this.props.name}</p>
        </div>
      </div>
    );
  }
}

export default AccountItem;
