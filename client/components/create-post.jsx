import React from 'react';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postBody: '',
      postTags: ''
    };
    this.goToViewPost = this.goToViewPost.bind(this);
  }

  goToViewPost(event) {
    this.props.setView('viewPost', {});
  }

  handleChange(event) {
    if (event.target.id === 'postBody') {
      this.setState({
        postBody: event.target.value
      });
    }

    if (event.target.id === 'postTags') {
      this.setState({
        postTags: event.target.value
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const newSubmission = {
      postBody: this.state.postBody,
      postTags: this.state.postTags
    };
    this.props.sendPost(newSubmission);
    this.setState({
      postBody: '',
      postTags: ''
    });
    event.currentTarget.reset();
  }

  render() {
    return (
      <div className="w-100 d-flex align-items-center flex-column">
        <form
          className="d-flex justify-content-center w-100 align-items-center
        flex-column form"
          onSubmit={this.handleSubmit}
        >
          <div className="w-100">
            <div className="text-custom-primary ml-1 mb-1 mt-1">
              Post body
            </div>
            <textarea
              className="generalText form-control"
              type="text"
              id="postBody"
              placeholder="post body"
              onChange={this.handleChange}
            />
          </div>
          <div className="w-100">
            <div className="text-custom-primary ml-1 mb-1 mt-1">
              Post tags
            </div>
            <textarea
              className="generalText form-control"
              type="text"
              id="postTags"
              placeholder="post tags"
              onChange={this.handleChange}
            />
          </div>
          <div className="mt-2 d-flex flex-row w-100 justify-content-center createPostButton">
            <button
              className="btn btn-custom text-custom-primary"
              onSubmit={this.handleSubmit}
              onClick={this.goToViewPost}
              type="submit"
              value="Submit">
              Create post
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreatePost;
