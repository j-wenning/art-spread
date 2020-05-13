import React from 'react';

export default class ViewComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: {},
      replies: [],
      reply: ''
    };
  }

  handleChange(e) {
    const style = e.currentTarget.style;
    style.height = 0;
    style.height = e.currentTarget.scrollHeight + 10 + 'px';
    this.setState({ reply: e.currentTarget.value });
  }

  viewComment(comment) {
    this.props.viewViewComment({ comment, replies: comment.children });
  }

  toggleLike(e, item, index) {
    e.stopPropagation();
    this.props.toggleLike(item.accountIndex, item.id, !item.liked)
      .then(() => this.setState(state => {
        const item = index === null ? state.comment : state.replies[index];
        item.liked = !item.liked;
        return state;
      })).catch(err => console.error(err));
  }

  publishReply() {
    this.props.publishReply(
      this.state.comment.accountIndex,
      this.state.comment.id,
      this.state.reply.trim())
      .then(data => {
        const replyInput = document.querySelector('#reply');
        replyInput.value = '';
        replyInput.style.height = 0;
        replyInput.style.height = replyInput.scrollHeight + 10 + 'px';
        this.setState(state => {
          state.replies.unshift(data[0]);
          return state;
        });
      }).catch(err => console.error(err));
  }

  componentDidMount() {
    this.setState({
      comment: this.props.comment,
      replies: this.props.replies
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        comment: this.props.comment,
        replies: this.props.replies
      });
    }
  }

  render() {
    const replies = this.state.replies
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
      <div className="view-comment container">
        <p
          className="col rounded bg-primary text-truncate text-primary p-3">
          {this.state.comment.handle}
        </p>
        <p
          className="col rounded bg-primary text-primary p-3">
          {this.state.comment.body}
        </p>
        <div className="col">
          <div className="row d-flex justify-content-between">
            <h3 className="text-primary text-capitalize mt-2">reply</h3>
            <button
              onClick={e => this.toggleLike(e, this.state.comment, null)}
              type="button"
              className="btn btn-custom-menu border-0">
              <i className={this.state.comment.liked ? 'fas fa-heart text-primary' : 'far fa-heart text-secondary'} />
            </button>
          </div>
        </div>
        <textarea
          onChange={e => this.handleChange(e)}
          id="reply"
          type="text"
          style={{ minHeight: '110px' }}
          className="col-12 rounded border-secondary bg-primary p-3 mt-2"/>
        <div className="text-center">
          <button
            disabled={!this.state.reply}
            onClick={() => this.publishReply()}
            type="button"
            className="btn btn-custom text-capitalize mt-2">
            send
          </button>
        </div>
        <div className="vh-60 overflow-auto bg-secondary py-4 mt-3">
          {replies.length
            ? replies
            : (
              <div className="col-12">
                <p
                  className="bg-primary rounded text-primary text-center text-capitalize py-2">
                  no replies
                </p>
              </div>
            )}
        </div>
      </div>
    );
  }
}
