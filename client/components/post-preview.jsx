import React from 'react';

export default class PostPreview extends React.Component {
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
        <div className="col-4 d-flex align-items-center">
          <img
            className="preview-image"
            src={this.props.post.img || './assets/images/default-image.svg'}
            alt=""
          />
        </div>
        <div className="col-7 ml-3">
          <p className="post-preview-fields text-custom-primary text-plate">
            {this.props.post.body.substr(0, 30) +
              (this.props.post.body.length > 30 ? '...' : '')}
          </p>
          <p className="post-preview-fields text-primary text-plate">
            {this.props.post.tags.substr(0, 30) +
              (this.props.post.tags.length > 30 ? '...' : '')}
          </p>
          <p className="post-preview-fields text-custom-primary text-plate">
            {this.state.analytics || 'loading...'}
          </p>
        </div>
      </div>
    );
  }
}
