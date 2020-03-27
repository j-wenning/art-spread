import React from 'react';

export default class AnalyticItem extends React.Component {

  render() {
    return (
      <div className="row text-custom-primary d-flex justify-content-around">
        <div className="mr-2">
          {this.props.analytic.type}:
        </div>
        <div>
          {this.props.analytic.likes}
          <i className="ml-1 fas fa-heart"></i>
        </div>
      </div>
    );
  }
}
