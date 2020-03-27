import React from 'react';

export default class CommentItem extends React.Component {

  render() {
    return (
      <div className="post-preview container">
        <div className="col">
          <div className="row">
            <div className="text-plate text-custom-primary col-10 mb-3">
              {this.props.comment.handle}
            </div>
            <div className="col-2 d-flex justify-content-center">
              <i onClick={this.props.like}
                className={`text-center ${this.props.comment.liked ? 'liked fas' : 'unliked far'} fa-heart fa-2x`}></i>
            </div>
          </div>
          <div className="row">
            <div onClick={this.props.setView} className="col-12 text-plate text-custom-primary">
              {this.props.comment.body}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
