import React from 'react';

export default class AnalyticItem extends React.Component {

  render() {
    let icon;
    if (this.props.analytic.type === 'reddit') {
      icon = <i className="fab fa-reddit fa-2x icon-color"></i>;
    }
    return (
      <div className="row text-custom-primary d-flex justify-content-around">
        <div className="mr-2">
          {icon}
        </div>
        <div className="analytic-font">
          {this.props.analytic.likes}
          <i className="ml-1 fas fa-heart"></i>
        </div>
      </div>
    );
  }
}
