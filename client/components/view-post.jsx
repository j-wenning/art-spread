import React from 'react';
import CommentItem from './comment-item';

export default class ViewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      analytics: null,
      comments: Array(5).fill(0).map((item, i) => ({
        commenter: 'commenter vanity',
        liked: false,
        commentBody: 'comment body',
        commentId: i
      }))
    };
  }

  getAnalytics() {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => this.setState({ analytics: data }));
  }

  getPost() {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        this.setState({ posts: data });
      });
  }

  getComments() {
    fetch('/api/comments')
      .then(res => res.json())
      .then(data => {
        this.setState({ comments: data });
      });
  }

  deletePost() {
    fetch(`/api/posts/${event.target.id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          comments: this.state.comments.concat(data)
        });
      });
  }

  componentDidMount() {
    this.getAnalytics();
    this.getPost();
    this.getComments();
  }

  handleClick(commentId) {
    this.setState(() => {
      const [...comments] = this.state.comments;
      const index = comments.findIndex(c =>
        c.commentId === commentId);
      comments[index].liked = !comments[index].liked;
      return comments;
    });
  }

  render() {
    const comments = this.state.comments.map(comment => <CommentItem
      key={comment.commentId} commenter={comment.commenter}
      like={() => this.handleClick(comment.commentId)}
      setView={() => this.props.setView('viewComments', {})}
      liked={comment.liked}
      commentBody={comment.commentBody} id={comment.commentId}/>);
    return (
      <div>
        <div className="d-flex justify-content-center">
          <img className="preview-image-lg" src="./assets/images/default-image.svg" alt=""/>
        </div>
        <div className="container-fluid mt-3 mb-3 ml-1 mr-1">
          <div className="horizontal-list overflow-auto row row-horizon flex-row
          flex-nowrap align-items-center">
            <div className="col-4">
              <div className="text-custom-primary">stats</div>
            </div>
            <div className="col-4">
              <div className="text-custom-primary">stats</div>
            </div>
            <div className="col-4">
              <div className="text-custom-primary">stats</div>
            </div>
            <div className="col-4">
              <div className="text-custom-primary">stats</div>
            </div>
            <div className="col-4">
              <div className="text-custom-primary">stats</div>
            </div>
            <div className="col-4">
              <div className="text-custom-primary">stats</div>
            </div>
          </div>
        </div>
        <div className="w-100">
          <div className="post-body p-2 text-custom-primary ml-1 mb-1 mt-1">
            Post body
          </div>
        </div>
        <div className="w-100 mt-3 mb-3">
          <div className="post-tags p-2 text-custom-primary ml-1 mb-1 mt-1">
            Post tags
          </div>
        </div>
        <div className="list overflow-auto">
          {comments}
        </div>
        <div className="mt-2 d-flex flex-row w-100 justify-content-center">
          <button onClick={this.deletePost} className="btn btn-custom text-custom-primary">
            Delete post
          </button>
        </div>
      </div>
    );
  }
}
