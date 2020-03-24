import React from 'react';

class ListItem extends React.Component {
  render() {
    return (
      <div id={this.props.listId} className="mt-2 mb-2 card d-flex align-items-center">
        <div className="d-flex flex-row">
          <a className="mt-2 mb-2">{this.props.name}</a>
        </div>
      </div>
    );
  }
}

export default ListItem;
