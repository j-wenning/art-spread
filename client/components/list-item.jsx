import React from 'react';

class ListItem extends React.Component {
  render() {
    return (
      <div id={this.props.listId} className="w-100 dropdown-background card d-flex align-items-center">
        <div className="w-100 d-flex flex-row justify-content-around">
          <i className="fab fa-reddit fa-2x icon-color mt-1"></i>
          <a className="text-custom-primary mt-2 mb-2 mr-2">{this.props.name}</a>
        </div>
      </div>
    );
  }
}

export default ListItem;
