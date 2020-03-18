import React from 'react';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postBody: '',
      postTags: ''
    };
    this.goToDashboard = this.goToDashboard.bind(this);
  }

  goToDashboard(event) {
    this.props.setView('dashboard', {});
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
        <nav className="d-flex justify-content-space-between navbar navbar-expand-lg navbar-light ">
          <h2 className="font-weight-bolder generalText">Create Post</h2>
          <h2 onClick={this.goToDashboard}>Back<i className="fas fa-arrow-left"></i></h2>
        </nav>
        <form className="d-flex justify-content-center w-100 align-items-center
        flex-column form" onSubmit={this.handleSubmit}>
          <div className="w-100">
            <div className="font-weight-bolder generalText ml-1 mb-1 mt-1">Post body</div>
            <textarea className="generalText form-control" type="text" id="postBody"
              placeholder="post body"
              onChange={this.handleChange} />
          </div>
          <div className="w-100">
            <div className="font-weight-bolder generalText ml-1 mb-1 mt-1">Post tags</div>
            <textarea className="generalText form-control" type="text" id="postTags"
              placeholder="post tags"
              onChange={this.handleChange} />
          </div>
          <div className="d-flex flex-row w-100 justify-content-end createPostButton">
            <button className="mt-3 mr-2 generalText btn-light font-weight-bolder rounded-lg loginButton"
              onSubmit={this.handleSubmit}
              type="submit" value="Submit">Create Post</button>
            <input className="mt-3 btn generalText font-weight-bolder
            rounded-lg loginButton" type="reset" value="Cancel" />
          </div>
        </form>
      </div>
    );
  }
}

export default CreatePost;
