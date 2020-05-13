import React from 'react';

export default class ViewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPublished: false,
      analytics: [],
      comments: []
    };
  }

  fetchPublications() {
    this.props.fetchPublications()
      .then(data => this.setState({
        analytics: data.map(item => item.analytics),
        comments: data.map(item => item.comments).flat()
      })).catch(err => console.error(err));
  }

  publishPost() {
    this.props.publishPost()
      .then(() => {
        this.props.post.isPublished = true;
        return this.fetchPublications();
      }).then(() => this.setState({ isPublished: true }))
      .catch(err => console.error(err));
  }

  viewComment(comment) {
    this.props.viewViewComment({ comment, replies: comment.children });
  }

  toggleLike(e, comment, index) {
    e.stopPropagation();
    this.props.toggleLike(comment.accountIndex, comment.id, !comment.liked)
      .then(() => this.setState(state => {
        const comment = state.comments[index];
        comment.liked = !comment.liked;
        return state;
      })).catch(err => console.error(err));
  }

  componentDidMount() {
    this.setState({ isPublished: this.props.post.isPublished });
    if (this.props.post.isPublished) {
      this.fetchPublications();
    }
  }

  render() {
    const analytics = this.state.analytics.map((item, index) => (
      <div
        key={index}
        title={item.account}
        className={index === this.state.analytics.length - 1 ? 'pr-3' : 'mr-4'}>
        <div className="d-flex align-items-center text-primary">
          <h2 className="mb-0">
            <i className={`fab fa-${item.platform} mr-2`}/>
            <i className="fas fa-heart mr-1"/>
            {item.likes}
          </h2>
        </div>
      </div>
    ));
    const comments = this.state.comments
      .sort((a, b) => b.created - a.created)
      .map((item, index) => (
        <a
          onClick={() => this.viewComment(item)}
          key={index}>
          <div className="col-12 mb-5">
            <div className="row">
              <div className="col">
                <p
                  className="col-12 rounded bg-primary text-truncate text-primary p-3">
                  {item.handle}
                </p>
              </div>
              <button
                onClick={e => this.toggleLike(e, item, index)}
                type="button"
                className="btn btn-custom-menu border-0 mr-3">
                <i className={item.liked ? 'fas fa-heart text-primary' : 'far fa-heart text-secondary'} />
              </button>
            </div>
            <p
              className="col-12 rounded bg-primary text-primary p-3">
              {item.body}
            </p>
          </div>
        </a>
      ));
    return (
      <div className="view-post container">
        <div className="col-12 text-center bg-dark">
          <img
            src={ this.props.post.imgPath || '/assets/images/default-image.svg'}
            alt=""
            className="col-8 py-1"/>
        </div>
        {this.state.isPublished && (
          <div className="col-12 d-flex overflow-auto bg-secondary text-nowrap p-3 mt-3">
            {analytics}
          </div>
        )}
        <h3 className="text-primary text-capitalize mt-3">title</h3>
        <p
          className="col-12 rounded border-secondary bg-primary text-primary p-3">
          {
            this.props.post.title ||
           <span className="col-12 d-block text-center text-capitalize">
             &lt;no title&gt;
           </span>
          }
        </p>
        <h3 className="text-primary text-capitalize mt-2">body</h3>
        <p
          className="col-12 rounded border-secondary bg-primary text-primary p-3">
          {
            this.props.post.body ||
           <span className="col-12 d-block text-center text-capitalize">
             &lt;no body&gt;
           </span>}
        </p>
        <h3 className="text-primary text-capitalize mt-2">tags</h3>
        <p
          className="col-12 rounded border-secondary bg-primary text-secondary p-3">
          {
            this.props.post.tags ||
            <span
              className="col-12 d-block text-center text-capitalize">
            &lt;no tags&gt;
            </span>
          }
        </p>
        <h3 className="text-primary text-capitalize mt-2">comments</h3>
        {this.state.isPublished && (
          <div className="vh-60 overflow-auto bg-secondary py-4 mt-2">
            {comments.length
              ? comments
              : (
                <div className="col-12">
                  <p
                    className="bg-primary rounded text-primary text-center text-capitalize py-2">
                  no comments
                  </p>
                </div>
              )}
          </div>
        )}
        <div className="text-center">
          {!this.state.isPublished && this.props.canPublish && (
            <div>
              <button
                onClick={() => this.publishPost()}
                type="button"
                className="btn btn-custom text-capitalize mt-2">
                publish
              </button>
              <br />
            </div>
          )}
          <button
            onClick={() => this.props.deletePost()}
            type="button"
            className="btn btn-custom text-capitalize mt-2">
            delete
          </button>
        </div>
      </div>
    );
  }
}
