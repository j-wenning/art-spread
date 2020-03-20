import React from 'react';

export default class CommentItem extends React.Component {

  render() {
    return (
      <div className="post-preview row col">
        <div id={this.props.commentId} className="col-5">
          <p className="text-custom-primary text-plate">{this.props.commenter}</p>
          <p className="text-primary text-plate">{this.props.commentBody}</p>
        </div>
      </div>
    );
  }
}
