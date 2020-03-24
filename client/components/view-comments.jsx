import React, { Component } from 'react';
import CommentItem from './comment-item';

export default class ViewComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: null,
      commenter: '',
      reply: '',
      commentThread: []
    };
  }

  createCommentsThread() {
    return (
      this.state.commentThread.map(comment => {
        return (
          <CommentItem
            key={comment.commentId}
            commenter={comment.commenter}
            like={() => this.handleClick(comment.commentId)}
            liked={comment.liked}
            commentBody={comment.commentBody}
            id={comment.commentId}/>
        );
      })
    );
  }

  render() {
    const comments = this.createCommentsThread();
    return (
      <div className="container">
        <div className="row">
          <img className="profile-picture-small" src="./assets/images/default-profile.svg"/>
          <h5 className="w-75 p-2 mb-3 row text-custom-primary commenter">{this.state.commenter}</h5>
        </div>
        <div className="w-100">
          <div className="post-body p-2 text-custom-primary ml-1 mb-1 mt-1">
            {this.state.comment}
          </div>
        </div>
        <div className="w-100">
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="form-row">
              <label htmlFor="reply">Reply</label>
            </div>
            <textarea
              id="reply"
              className="generalText form-row form-control"
              type="text"
              placeholder="Reply here"
              onChange={this.handleChange}/>
            <div className="form-row">
              <button type="submit" onClick={this.props.submitReply} className="btn btn-custom text-custom-primary">Reply</button>
            </div>
          </form>
        </div>
        <div className="list overflow-auto">
          {comments}
        </div>
      </div>
    );
  }
}
