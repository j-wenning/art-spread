import React from 'react';
import CommentItem from './comment-item';
import AnalyticItem from './analytic-item';

export default class ViewPost extends React.Component {
  constructor(props) {
    super(props);
    this.post = this.props.params.post;
    this.state = {
      published: this.post.published,
      analytics: [],
      comments: []
    };
  }

  getPost() {
    if (this.post.published) {
      fetch(`/api/post/${this.post.postId}`)
        .then(res => res.json())
        .then(data => {
          this.setState({
            analytics: data.map(item => item.analytics),
            comments: data.map(item => item.comments)
              .flat()
              .sort((a, b) => a.time - b.time)
          });
        });
    }
  }

  publishPost() {
    fetch(`/api/publish/${this.post.postId}`, {
      method: 'POST'
    }).then(() => this.setState({ published: true }))
      .then(() => setTimeout(() => this.getPost(), 1500))
      .catch(err => console.error(err));
  }

  deletePost() {
    fetch(`/api/post/${this.post.postId}`, {
      method: 'DELETE'
    }).then(() => {
      this.props.setView('dashboard', {});
    })
      .catch(err => console.error(err));
  }

  componentDidMount() {
    if (this.state.published) this.getPost();
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
      key={comment.time}
      comment={comment}
      like={() => this.handleClick(comment.commentId)}
      setView={() => this.props.setView('viewComments', { comment: comment })}/>);
    const analytics = this.state.analytics.map(analytic =>
      <AnalyticItem
        key={analytic.publicationId}
        analytic={analytic}
      />);
    if (this.state.published) {
      return (
        <div>
          <div className="d-flex justify-content-center">
            <img
              className="preview-image-lg"
              src={this.post.imgPath || './assets/images/default-image.svg'}
              alt=""/>
          </div>
          <div className="container-fluid mt-3 mb-3 ml-1 mr-1">
            <div className="horizontal-list overflow-auto row row-horizon flex-row
          flex-nowrap align-items-center justify-content-around">
              {analytics}
            </div>
          </div>
          <div className="w-100">
            <div className="text-plate p-2 text-custom-primary ml-1 mb-1 mt-1">
              {this.post.title}
            </div>
          </div>
          {
            !!this.post.body &&
          <div className="w-100 mt-3 mb-3">
            <div className="text-plate p-2 text-custom-primary ml-1 mb-1 mt-1">
              {this.post.body}
            </div>
          </div>
          }
          {
            !!this.post.tags &&
          <div className="w-100 mt-3 mb-3">
            <div className="text-plate p-2 text-primary ml-1 mb-1 mt-1">
              {this.post.tags.replace(/#/g, ' #')}
            </div>
          </div>
          }
          <div className="list overflow-auto">
            {comments}
          </div>
          <div className="mt-2 d-flex flex-row w-100 justify-content-center">
            <button onClick={() => this.deletePost()} className="btn btn-custom text-custom-primary">
            Delete post
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="d-flex justify-content-center">
            <img
              className="preview-image-lg"
              src={this.post.imgPath || './assets/images/default-image.svg'}
              alt="" />
          </div>
          <div className="container-fluid mt-3 mb-3 ml-1 mr-1">
            <div className="horizontal-list overflow-auto row row-horizon flex-row
          flex-nowrap align-items-center justify-content-around">
              Not published
            </div>
          </div>
          <div className="w-100">
            <div className="text-plate p-2 text-custom-primary ml-1 mb-1 mt-1">
              {this.post.title}
            </div>
          </div>
          {
            !!this.post.body &&
            <div className="w-100 mt-3 mb-3">
              <div className="text-plate p-2 text-custom-primary ml-1 mb-1 mt-1">
                {this.post.body}
              </div>
            </div>
          }
          {
            !!this.post.tags &&
            <div className="w-100 mt-3 mb-3">
              <div className="text-plate p-2 text-primary ml-1 mb-1 mt-1">
                {this.post.tags.replace(/#/g, ' #')}
              </div>
            </div>
          }
          <div className="mt-2 d-flex flex-row w-100 justify-content-around">
            <button onClick={() => this.publishPost()} className="btn btn-custom text-custom-primary">
              Publish post
            </button>
            <button onClick={() => this.deletePost()} className="btn btn-custom text-custom-primary">
              Delete post
            </button>
          </div>
        </div>
      );
    }
  }
}
