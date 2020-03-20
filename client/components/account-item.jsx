import React from 'react';

class AccountItem extends React.Component {
  render() {
    return (
      <div id={this.props.accountId} className="mt-2 mb-2 card d-flex align-items-center">
        <div className="d-flex flex-row">
          <div className="mt-2 mb-2">{this.props.name}</div>
        </div>
      </div>
    );
  }
}

export default AccountItem;
