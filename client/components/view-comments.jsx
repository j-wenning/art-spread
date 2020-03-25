import React, { Component } from 'react';
import CommentItem from './comment-item';

export default class ViewComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: {
        commenter: 'sample vanity',
        liked: false,
        commentBody: 'sample comment',
        commentId: 'sample'
      },
      reply: '',
      commentThread: Array(5).fill(0).map((item, i) => ({
        commenter: 'commenter vanity',
        liked: false,
        commentBody: 'comment body',
        commentId: i
      }))
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createCommentsThread = this.createCommentsThread.bind(this);
  }

  componentDidMount() {
    this.getComment();
    this.getCommentThread();
  }

  getComment() {
    const commentId = this.props.commentId;
    fetch(`/api/comments/${commentId}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          comment: data
        });
      });
  }

  getCommentThread() {
    const commentId = this.props.commentId;
    fetch(`/api/comments/${commentId}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          commentThread: data
        });
      });
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const commentId = this.props.commentId;
    const newReply = {
      reply: this.state.reply
    };
    const fetchParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReply)
    };
    fetch(`/api/comments/${commentId}`, fetchParams)
      .then(res => {
        console.warn(res);
      });
    this.props.setView('viewPost', {});
    this.setState({
      reply: ''
    });
    e.currentTarget.reset();
  }

  handleClick(commentId) {
    this.setState(() => {
      const [...commentThread] = this.state.commentThread;
      const index = commentThread.findIndex(c =>
        c.commentId === commentId);
      commentThread[index].liked = !commentThread[index].liked;
      return commentThread;
    });
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
          <h5 className="w-75 p-2 mb-3 row text-custom-primary commenter">{this.state.comment.commenter}</h5>
        </div>
        <div className="w-100">
          <div className="post-body p-2 text-custom-primary ml-1 mb-1 mt-1">
            {this.state.comment.commentBody}
          </div>
          <i onClick={() => this.handleClick(this.state.comment.commentId)}
            className={`ml-5 ${this.state.comment.liked ? 'liked' : 'unliked'} far fa-heart fa-2x`}></i>
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
