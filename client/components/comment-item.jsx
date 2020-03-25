import React from 'react';

export default class CommentItem extends React.Component {

  render() {
    return (
      <div className="post-preview">
        <div id={this.props.commentId} >
          <div className="w-75 p-2 mb-3 row text-custom-primary commenter">
            {this.props.commenter}
          </div>
          <i onClick={this.props.like}
            className={`ml-5 ${this.props.liked ? 'liked' : 'unliked'} far fa-heart fa-2x`}></i>
          <div onClick={this.props.setView} className="p-2 mb-3 text-custom-primary comment-body row">
            {this.props.commentBody}
          </div>
        </div>
      </div>
    );
  }
}
