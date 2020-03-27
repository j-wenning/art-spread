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
      <div onClick={this.props.viewPost} className="post-preview row col">
        <div className="col-4 d-flex align-items-center ">
          <div className={this.props.pending ? 'pending-icon-relative' : ''}>
            <div className={`text-custom-primary ${this.props.pending ? 'mb-4 pending-icon align-items-center far fa-clock fa-border-icon' : ''}`}></div>
            <img
              className="preview-image"
              src={this.props.post.imgPath || './assets/images/default-image.svg'}
              alt=""
            />
          </div>
        </div>

        <div className="col-7 ml-3">
          <p className="post-preview-fields text-custom-primary text-plate">
            {this.props.post.title}
          </p>
          <p className="post-preview-fields text-custom-primary text-plate">
            {this.props.post.body}
          </p>
          <p className="post-preview-fields text-primary text-plate">
            {this.props.post.tags}
          </p>
        </div>
      </div>
    );
  }
}
