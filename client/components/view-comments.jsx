import React, { Component } from 'react';
// import CommentItem from './comment-item';

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

  render() {
    return (
      <div>
        <div className="d-flex">
          <img className="profile-picture-small" src="./assets/images/default-profile.svg"/>
          <h5 className="w-75 p-2 mb-3 row text-custom-primary commenter"></h5>
        </div>
      </div>
    );
  }
}
