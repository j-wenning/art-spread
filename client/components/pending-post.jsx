import React from 'react';

export default class PendingPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = { analytics: null };
  }

  getAnalytics() {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => this.setState({ analytics: data }));
  }

  render() {
    return (
      <div className="post-preview row col">
        <div className="col-4 d-flex align-items-center ">
          <div className="pending-icon-relative ">
            <div className=" text-custom-primary mb-4 pending-icon align-items-center far fa-clock fa-border-icon"></div>
            <img
              className="preview-image"
              src={this.props.post.img || './assets/images/default-image.svg'}
              alt=""
            />
          </div>
        </div>

        <div className="col-8">
          <p className="text-custom-primary text-plate">
            {this.props.post.body.substr(0, 30) +
              (this.props.post.body.length > 30 ? '...' : '')}
          </p>
          <p className="post-preview-fields text-primary text-plate">
            {this.props.post.tags.substr(0, 30) +
              (this.props.post.tags.length > 30 ? '...' : '')}
          </p>
          <p className="text-custom-primary text-plate">
            {this.state.analytics || 'loading...'}
          </p>
        </div>
      </div>
    );
  }
}
